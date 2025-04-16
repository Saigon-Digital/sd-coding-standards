#!/usr/bin/env node

const { program } = require('commander');
const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const inquirer = require('inquirer');
const ora = require('ora');

// Set up CLI
program
  .name('sd-standards')
  .description('Apply Saigon Digital coding standards to Next.js projects')
  .version('1.0.0')
  .option('-y, --yes', 'Skip confirmation prompts')
  .option('-p, --path <path>', 'Path to Next.js project', process.cwd())
  .option('--skip-deps', 'Skip installing dependencies')
  .option('--skip-git-hooks', 'Skip setting up git hooks')
  .parse(process.argv);

const options = program.opts();

// Main function
async function main() {
  console.log(chalk.bold.blue('\n🚀 Saigon Digital Coding Standards CLI\n'));
  
  const targetPath = path.resolve(options.path);
  
  // Check if target directory exists and is a Next.js project
  if (!fs.existsSync(targetPath)) {
    console.error(chalk.red(`❌ Directory ${targetPath} does not exist`));
    process.exit(1);
  }
  
  const packageJsonPath = path.join(targetPath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.error(chalk.red(`❌ No package.json found in ${targetPath}. Is this a valid Next.js project?`));
    process.exit(1);
  }
  
  const packageJson = require(packageJsonPath);
  const hasNextJs = packageJson.dependencies && (packageJson.dependencies.next || packageJson.devDependencies?.next);
  
  if (!hasNextJs) {
    console.warn(chalk.yellow('⚠️ This doesn\'t appear to be a Next.js project. Next.js dependency not found.'));
    
    if (!options.yes) {
      const { proceed } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'proceed',
          message: 'Do you want to proceed anyway?',
          default: false
        }
      ]);
      
      if (!proceed) {
        console.log(chalk.blue('👋 Operation cancelled'));
        process.exit(0);
      }
    }
  }
  
  // Confirm with user
  if (!options.yes) {
    console.log(chalk.cyan('This will apply Saigon Digital coding standards to your project:'));
    console.log(chalk.cyan('- ESLint configuration'));
    console.log(chalk.cyan('- Prettier configuration'));
    console.log(chalk.cyan('- TypeScript configuration'));
    console.log(chalk.cyan('- Git hooks for linting and type checking'));
    console.log(chalk.cyan('- Required dependencies\n'));
    
    const { confirm } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirm',
        message: `Apply standards to ${targetPath}?`,
        default: true
      }
    ]);
    
    if (!confirm) {
      console.log(chalk.blue('👋 Operation cancelled'));
      process.exit(0);
    }
  }
  
  // Apply configurations
  const spinner = ora('Applying coding standards...').start();
  
  try {
    // Copy configuration files
    const templatesDir = path.join(__dirname, '../templates');
    
    // Copy ESLint config
    fs.copyFileSync(
      path.join(templatesDir, '.eslintrc.js'),
      path.join(targetPath, '.eslintrc.js')
    );
    
    // Copy Prettier config
    fs.copyFileSync(
      path.join(templatesDir, '.prettierrc.js'),
      path.join(targetPath, '.prettierrc.js')
    );
    
    // Copy or merge tsconfig.json
    const targetTsConfigPath = path.join(targetPath, 'tsconfig.json');
    if (fs.existsSync(targetTsConfigPath)) {
      const sourceTsConfig = require(path.join(templatesDir, 'tsconfig.json'));
      const targetTsConfig = require(targetTsConfigPath);
      
      // Merge compilerOptions, preserving project-specific paths
      targetTsConfig.compilerOptions = {
        ...sourceTsConfig.compilerOptions,
        ...targetTsConfig.compilerOptions,
        // Ensure strict mode is enabled
        strict: true,
        // Preserve project-specific paths if they exist
        paths: targetTsConfig.compilerOptions?.paths || sourceTsConfig.compilerOptions.paths
      };
      
      // Write merged config
      fs.writeFileSync(
        targetTsConfigPath,
        JSON.stringify(targetTsConfig, null, 2)
      );
    } else {
      // If no tsconfig exists, copy the template one
      fs.copyFileSync(
        path.join(templatesDir, 'tsconfig.json'),
        targetTsConfigPath
      );
    }
    
    // Update package.json with scripts and configurations
    const updatedPackageJson = {
      ...packageJson,
      scripts: {
        ...packageJson.scripts,
        lint: 'next lint',
        'lint:fix': 'next lint --fix',
        format: 'prettier --write "**/*.{js,jsx,ts,tsx,json,md}" --ignore-path .gitignore',
        'type-check': 'tsc --noEmit',
        prepare: 'simple-git-hooks'
      }
    };
    
    // Add git hooks config if not skipped
    if (!options['skip-git-hooks']) {
      updatedPackageJson['simple-git-hooks'] = {
        'pre-commit': 'npx lint-staged',
        'pre-push': 'npm run type-check'
      };
      
      updatedPackageJson['lint-staged'] = {
        '*.{js,jsx,ts,tsx}': [
          'eslint --fix --cache',
          'prettier --write'
        ],
        '*.{json,md,css}': [
          'prettier --write'
        ]
      };
    }
    
    // Write updated package.json
    fs.writeFileSync(
      packageJsonPath,
      JSON.stringify(updatedPackageJson, null, 2)
    );
    
    // Create postcss.config.js if it doesn't exist
    const postcssConfigPath = path.join(targetPath, 'postcss.config.js');
    if (!fs.existsSync(postcssConfigPath)) {
      fs.copyFileSync(
        path.join(templatesDir, 'postcss.config.js'),
        postcssConfigPath
      );
    }
    
    // Create tailwind.config.js if it doesn't exist
    const tailwindConfigPath = path.join(targetPath, 'tailwind.config.js');
    if (!fs.existsSync(tailwindConfigPath)) {
      fs.copyFileSync(
        path.join(templatesDir, 'tailwind.config.js'),
        tailwindConfigPath
      );
    }
    
    // Copy .vscode folder if it doesn't exist or merge if it does
    const vscodePath = path.join(targetPath, '.vscode');
    if (!fs.existsSync(vscodePath)) {
      fs.mkdirSync(vscodePath, { recursive: true });
    }
    
    // Copy VS Code settings
    const vscodeSettingsPath = path.join(vscodePath, 'settings.json');
    if (fs.existsSync(vscodeSettingsPath)) {
      // Merge settings if file exists
      const sourceSettings = require(path.join(templatesDir, '.vscode', 'settings.json'));
      const targetSettings = require(vscodeSettingsPath);
      
      // Merge settings, giving priority to our standardized settings
      const mergedSettings = { ...targetSettings, ...sourceSettings };
      
      fs.writeFileSync(
        vscodeSettingsPath,
        JSON.stringify(mergedSettings, null, 2)
      );
    } else {
      // Copy if file doesn't exist
      fs.copyFileSync(
        path.join(templatesDir, '.vscode', 'settings.json'),
        vscodeSettingsPath
      );
    }
    
    // Copy VS Code extensions recommendations
    const vscodeExtensionsPath = path.join(vscodePath, 'extensions.json');
    if (fs.existsSync(vscodeExtensionsPath)) {
      // Merge extensions if file exists
      const sourceExtensions = require(path.join(templatesDir, '.vscode', 'extensions.json'));
      const targetExtensions = require(vscodeExtensionsPath);
      
      // Combine recommendations without duplicates
      const allRecommendations = [
        ...new Set([
          ...(targetExtensions.recommendations || []),
          ...(sourceExtensions.recommendations || [])
        ])
      ];
      
      fs.writeFileSync(
        vscodeExtensionsPath,
        JSON.stringify({ recommendations: allRecommendations }, null, 2)
      );
    } else {
      // Copy if file doesn't exist
      fs.copyFileSync(
        path.join(templatesDir, '.vscode', 'extensions.json'),
        vscodeExtensionsPath
      );
    }
    
    // Copy GitHub CI workflow
    const githubWorkflowsPath = path.join(targetPath, '.github', 'workflows');
    if (!fs.existsSync(githubWorkflowsPath)) {
      fs.mkdirSync(githubWorkflowsPath, { recursive: true });
    }
    
    // Copy CI workflow file
    const ciWorkflowPath = path.join(githubWorkflowsPath, 'ci.yml');
    if (!fs.existsSync(ciWorkflowPath)) {
      fs.copyFileSync(
        path.join(templatesDir, '.github', 'workflows', 'ci.yml'),
        ciWorkflowPath
      );
    } else {
      console.log(chalk.yellow('⚠️ CI workflow file already exists. Skipping...'));
      console.log(chalk.yellow('   You may want to manually merge the CI workflow file.'));
    }
    
    spinner.succeed('Configuration files applied successfully');
    
    // Install dependencies if not skipped
    if (!options['skip-deps']) {
      spinner.text = 'Installing required dependencies...';
      spinner.start();
      
      const { execSync } = require('child_process');
      
      try {
        // Determine package manager
        const useYarn = fs.existsSync(path.join(targetPath, 'yarn.lock'));
        const usePnpm = fs.existsSync(path.join(targetPath, 'pnpm-lock.yaml'));
        
        const packageManager = usePnpm ? 'pnpm' : (useYarn ? 'yarn' : 'npm');
        const installCmd = packageManager === 'npm' ? 'install' : 'add';
        
        // Install dev dependencies
        const devDependencies = [
          '@typescript-eslint/eslint-plugin@^6.15.0',
          '@typescript-eslint/parser@^6.15.0',
          'eslint@^8.56.0',
          'eslint-config-next@^14.0.4',
          'eslint-config-prettier@^9.1.0',
          'eslint-plugin-import@^2.29.1',
          'eslint-plugin-jsx-a11y@^6.8.0',
          'eslint-plugin-react@^7.33.2',
          'eslint-plugin-react-hooks@^4.6.0',
          'eslint-plugin-tailwindcss@^3.13.0',
          'eslint-plugin-testing-library@^6.0.0',
          'lint-staged@^15.2.0',
          'prettier@^3.1.1',
          'prettier-plugin-tailwindcss@^0.5.9',
          'simple-git-hooks@^2.9.0'
        ];
        
        execSync(`${packageManager} ${installCmd} -D ${devDependencies.join(' ')}`, {
          cwd: targetPath,
          stdio: 'ignore'
        });
        
        spinner.succeed('Dependencies installed successfully');
      } catch (error) {
        spinner.fail('Failed to install dependencies');
        console.error(chalk.red(`Error: ${error.message}`));
        console.log(chalk.yellow('You may need to install dependencies manually.'));
      }
    }
    
    console.log(chalk.green('\n✅ Saigon Digital coding standards applied successfully!'));
    console.log(chalk.cyan('\nNext steps:'));
    console.log(chalk.cyan('1. Run `npm run lint:fix` to fix linting issues'));
    console.log(chalk.cyan('2. Run `npm run format` to format your code'));
    console.log(chalk.cyan('3. Run `npm run type-check` to check for TypeScript errors\n'));
    
  } catch (error) {
    spinner.fail('Failed to apply coding standards');
    console.error(chalk.red(`Error: ${error.message}`));
    process.exit(1);
  }
}

main().catch(error => {
  console.error(chalk.red(`Error: ${error.message}`));
  process.exit(1);
});
