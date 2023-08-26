import { program } from 'commander';
import { runCommand } from './util.js';
program.name('mtk-tool').description('用与开发maptalks应用或插件的cli工具').version('0.0.1');
program
    .command('compile')
    .description('将函数编译为maptalks worker需要的格式')
    .requiredOption('-i,--input <string>', 'worker源代码目录')
    .option('-o,--output <string>', '编译后的worker文件目录', 'mtk-worker')
    .action(runCompile);
async function runCompile(options) {
    try {
        await runCommand(options.input, options.output);
        // console.log(options);
    }
    catch (error) {
        console.error(error);
    }
}
program.parseAsync(process.argv);
