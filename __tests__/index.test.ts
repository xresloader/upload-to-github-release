import micromatch from 'micromatch';
import { env } from "string-env-interpolation";

import * as lib from '../src/index';

test('Test delete_file rule', () => {
    const delete_files_pattern = "random-name-*.txt;random-*.txt".split(";")
        .map((v) => v.trim())
        .filter((v) => !!v);
    expect(delete_files_pattern.length).toBe(2);

    expect (delete_files_pattern && micromatch.isMatch("random-name-2bf0a034.txt", delete_files_pattern)).toBe(true);
    expect (delete_files_pattern && micromatch.isMatch("random-name-d1e43358.txt", delete_files_pattern)).toBe(true);
});

test('Test parse var with env', () => {
    expect (env('${PATH}') == '${PATH}').toBe(false);
    expect (env('$PATH')).toBe('$PATH');
});