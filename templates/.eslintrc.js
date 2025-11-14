import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';
import stylistic from '@stylistic/eslint-plugin';
import eslintPluginBetterTailwindcss from 'eslint-plugin-better-tailwindcss';
import { globalIgnores } from 'eslint/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
	baseDirectory: __dirname,
});

const eslintConfig = [
	...compat.extends('next/core-web-vitals', 'next/typescript'),
	stylistic.configs.customize({
		semi: true,
		quotes: 'single',
		indent: 'tab',
		braceStyle: '1tbs',
		arrowParens: true,
	}),
	{
		plugins: {
			'better-tailwindcss': eslintPluginBetterTailwindcss,
		},
		rules: {
			...eslintPluginBetterTailwindcss.configs['recommended-warn'].rules,
			// 'better-tailwindcss/no-restricted-classes': 0,
			'better-tailwindcss/enforce-consistent-line-wrapping': 0, // ["warn", { group: "newLine", preferSingleLine: true, printWidth: 100 }]
			'better-tailwindcss/no-restricted-classes': ['error', {
				restrict: [
					// ── Position (left/right → start/end)
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(left)-([\\w./\\[\\]%+-]+)$',
						message: 'Use \'$1start-$3\' instead of \'$2-$3\'.',
						fix: '$1start-$3',
					},
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(right)-([\\w./\\[\\]%+-]+)$',
						message: 'Use \'$1end-$3\' instead of \'$2-$3\'.',
						fix: '$1end-$3',
					},

					// ── Margin (ml/mr → ms/me)
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(ml)-([\\w./\\[\\]%+-]+)$',
						message: 'Use \'$1ms-$3\' instead of \'$2-$3\'.',
						fix: '$1ms-$3',
					},
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(mr)-([\\w./\\[\\]%+-]+)$',
						message: 'Use \'$1me-$3\' instead of \'$2-$3\'.',
						fix: '$1me-$3',
					},

					// ── Padding (pl/pr → ps/pe)
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(pl)-([\\w./\\[\\]%+-]+)$',
						message: 'Use \'$1ps-$3\' instead of \'$2-$3\'.',
						fix: '$1ps-$3',
					},
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(pr)-([\\w./\\[\\]%+-]+)$',
						message: 'Use \'$1pe-$3\' instead of \'$2-$3\'.',
						fix: '$1pe-$3',
					},

					// ── Text alignment (text-left/right → text-start/end)
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(text)-(left)$',
						message: 'Use \'$1text-start\' instead of \'$2-$3\'.',
						fix: '$1text-start',
					},
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(text)-(right)$',
						message: 'Use \'$1text-end\' instead of \'$2-$3\'.',
						fix: '$1text-end',
					},

					// ── Float / Clear (left/right → start/end)
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(float)-(left)$',
						message: 'Use \'$1float-start\' instead of \'$2-$3\'.',
						fix: '$1float-start',
					},
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(float)-(right)$',
						message: 'Use \'$1float-end\' instead of \'$2-$3\'.',
						fix: '$1float-end',
					},
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(clear)-(left)$',
						message: 'Use \'$1clear-start\' instead of \'$2-$3\'.',
						fix: '$1clear-start',
					},
					{
						pattern: '^((?:[\\w-:/\\[\\]@]+:)?)(clear)-(right)$',
						message: 'Use \'$1clear-end\' instead of \'$2-$3\'.',
						fix: '$1clear-end',
					},
				],
			}],
		},
		settings: {
			'better-tailwindcss': {
				entryPoint: 'src/app/globals.css',
			},
		},
	},
	{
		rules: {
			'eqeqeq': ['error', 'always'],
			'@stylistic/no-mixed-spaces-and-tabs': ['error', 'smart-tabs'],
			'object-shorthand': 'error',
			'@stylistic/operator-linebreak': [
				'error',
				'after',
				{ overrides: { '?': 'before', ':': 'before', '|': 'before' } },
			],
			'@stylistic/multiline-ternary': [
				'error',
				'always-multiline',
				{
					ignoreJSX: true,
				},
			],
			'@stylistic/jsx-one-expression-per-line': 0,
		},
	},
	{
		files: ['**/*.ts', '**/*.tsx'],
		rules: {
			'@typescript-eslint/no-unused-expressions': [
				'error',
				{ allowShortCircuit: true, allowTernary: true },
			],
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					varsIgnorePattern: '^_',
					argsIgnorePattern: '^_',
				},
			],
		},
	},
	globalIgnores(['next-env.d.ts', 'next-sitemap.config.*']),
];

export default eslintConfig;
