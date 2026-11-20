import { describe, expect, it } from 'vitest';
import { validateRegistration, validateSubmission, validateResults, normalisePhone, normaliseGithub, suggestEmail, LIMITS } from '@/lib/validation.js';
import { registrationBody, submissionBody } from '../helpers/fixtures.js';

describe('validateRegistration', () => {
  it('accepts a valid solo registration and normalises it', () => {
    const { data, errors } = validateRegistration(registrationBody({ email: '  Me@Example.COM ', whatsapp: '017-1234 5678', github: '@me' }));
    expect(errors).toEqual({});
    expect(data).toMatchObject({ email: 'me@example.com', whatsapp: '01712345678', github: 'me', teamName: '', members: [] });
  });

  it('uses the chosen team leader as the name and drops empty members', () => {
    const { data, errors } = validateRegistration(registrationBody({ registrationType: 'team', teamName: 'X', members: ['A', '', 'C'], teamLeader: 2 }));
    expect(errors).toEqual({});
    expect(data.fullName).toBe('C');
    expect(data.members).toEqual(['A', 'C']);
  });

  it('falls back to the first filled member when the leader slot is empty', () => {
    const { data } = validateRegistration(registrationBody({ registrationType: 'team', teamName: 'X', members: ['', 'B', ''], teamLeader: 0 }));
    expect(data.fullName).toBe('B');
  });

  it('flags every missing field', () => {
    const { errors } = validateRegistration({});
    expect(Object.keys(errors).sort()).toEqual(
      ['agree', 'className', 'email', 'features', 'fullName', 'github', 'institution', 'problem', 'productName', 'registrationType', 'users', 'whatsapp'].sort()
    );
  });

  it('requires a team name and a member for teams', () => {
    const { errors } = validateRegistration(registrationBody({ registrationType: 'team', teamName: '', members: ['', '', ''] }));
    expect(errors).toHaveProperty('teamName');
    expect(errors).toHaveProperty('members');
  });

  it.each(['0171234567', '02123456789', '01212345678', '+8811712345678', 'abc'])('rejects WhatsApp number %s', (whatsapp) => {
    expect(validateRegistration(registrationBody({ whatsapp })).errors).toHaveProperty('whatsapp');
  });

  it('rejects oversized text', () => {
    const { errors } = validateRegistration(registrationBody({ problem: 'x'.repeat(4001), productName: 'p'.repeat(161) }));
    expect(errors).toHaveProperty('problem');
    expect(errors).toHaveProperty('productName');
  });

  it('requires agree to be exactly true', () => {
    expect(validateRegistration(registrationBody({ agree: 'true' })).errors).toHaveProperty('agree');
  });

  it('ignores more than three members and an out-of-range leader index', () => {
    const { data } = validateRegistration(registrationBody({ registrationType: 'team', teamName: 'X', members: ['A', 'B', 'C', 'D'], teamLeader: 7 }));
    expect(data.members).toEqual(['A', 'B', 'C']);
    expect(data.fullName).toBe('A');
  });
});

describe('normalisers', () => {
  it.each([
    ['01712345678', '01712345678'],
    ['+8801712345678', '01712345678'],
    ['008801712345678', '01712345678'],
    ['০১৭১২৩৪৫৬৭৮', '01712345678'],
    [' 017 1234-5678 ', '01712345678'],
    ['88017', '88017'],
  ])('normalisePhone(%s) = %s', (input, out) => expect(normalisePhone(input)).toBe(out));

  it.each([
    ['https://github.com/rahim-dev', 'rahim-dev'],
    ['http://www.github.com/rahim-dev/repo?tab=1', 'rahim-dev'],
    ['github.com/rahim-dev/', 'rahim-dev'],
    ['@Rahim', 'Rahim'],
    ['plain', 'plain'],
  ])('normaliseGithub(%s) = %s', (input, out) => expect(normaliseGithub(input)).toBe(out));

  it('suggests a fix for common email typos only', () => {
    expect(suggestEmail('rahim@gmial.com')).toBe('rahim@gmail.com');
    expect(suggestEmail('rahim@gmail.con')).toBe('rahim@gmail.com');
    expect(suggestEmail('rahim@yaho.com')).toBe('rahim@yahoo.com');
    expect(suggestEmail('rahim@gmail.com')).toBeNull();
    expect(suggestEmail('rahim@du.ac.bd')).toBeNull();
    expect(suggestEmail('nope')).toBeNull();
  });

  it('counts Bangla text by characters, like the database', () => {
    expect(validateRegistration(registrationBody({ fullName: 'ক'.repeat(LIMITS.fullName) })).errors).toEqual({});
    expect(validateRegistration(registrationBody({ fullName: 'ক'.repeat(LIMITS.fullName + 1) })).errors).toHaveProperty('fullName');
  });

  it('says how many digits a phone number has when the length is wrong', () => {
    expect(validateRegistration(registrationBody({ whatsapp: '0171234567' })).errors.whatsapp).toContain('১০');
  });
});

describe('validateSubmission', () => {
  it('accepts a GitHub submission', () => {
    expect(validateSubmission(submissionBody()).errors).toEqual({});
  });

  it('needs a real github.com repo URL and README confirmation for GitHub builds', () => {
    const { errors } = validateSubmission(submissionBody({ githubUrl: 'https://gitlab.com/a/b', readme: false }));
    expect(errors).toHaveProperty('githubUrl');
    expect(errors).toHaveProperty('readme');
  });

  it('does not need GitHub or README for Lovable / v0, and drops a stray GitHub URL', () => {
    const { data, errors } = validateSubmission(submissionBody({ platform: 'lovable', githubUrl: 'nope', readme: false }));
    expect(errors).toEqual({});
    expect(data.githubUrl).toBe('');
  });

  it('rejects unknown platforms and non-http links', () => {
    const { errors } = validateSubmission(submissionBody({ platform: 'replit', liveUrl: 'javascript:alert(1)', demoUrl: 'ftp://x' }));
    expect(errors).toHaveProperty('platform');
    expect(errors).toHaveProperty('liveUrl');
    expect(errors).toHaveProperty('demoUrl');
  });
});

describe('validateResults', () => {
  const row = { place: '1st', name: 'A', email: 'A@X.com', product: 'P', marks: 90 };
  it('numbers ranks in order and lowercases emails', () => {
    const { rows } = validateResults([row, { ...row, place: '2nd', marks: '' }]);
    expect(rows.map((r) => [r.rank, r.email, r.marks])).toEqual([[1, 'a@x.com', 90], [2, 'a@x.com', null]]);
  });
  it('allows an empty list (unpublish) but not more than ten', () => {
    expect(validateResults([]).rows).toEqual([]);
    expect(validateResults(Array(11).fill(row)).error).toBeTruthy();
  });
  it('rejects missing fields and bad marks', () => {
    expect(validateResults([{ ...row, email: 'nope' }]).error).toBeTruthy();
    expect(validateResults([{ ...row, marks: 101 }]).error).toBeTruthy();
    expect(validateResults([{ ...row, marks: 9.5 }]).error).toBeTruthy();
    expect(validateResults('x').error).toBeTruthy();
  });
});
