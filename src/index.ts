import { program } from 'commander'
import { runCommand } from './util'

program.name('mtk-tool').description('用与开发maptalks应用或插件的cli工具').version('1.0.0')

program
  .command('compile')
  .description('将函数编译为maptalks worker需要的格式')
  .requiredOption('-i,--input <string>', 'worker源代码目录')
  .option('-o,--output <string>', '编译后的worker文件目录', 'mtk-worker')
  .action(runCompile)

/**
 * 开始编译
 * @param options 
 */
async function runCompile(options: any) {
  try {
    await runCommand(options.input, options.output)
  } catch (error) {
    console.error(error)
  }
}

program.parseAsync(process.argv).catch(error => {
  console.error(error);
})
