import { join, basename } from 'node:path';
import { readdir, mkdir, stat, readFile, writeFile } from 'node:fs/promises';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import swc from '@rollup/plugin-swc';
import commonjs from '@rollup/plugin-commonjs';
import { rollup } from 'rollup';
const currentPath = process.cwd();
const testInputDir = 'test/worker-source';
const testOutputDir = 'test/mtk-worker';
/**
 * 运行命令
 * @param inputDir
 * @param outputDir
 * @returns
 */
export async function runCommand(inputDir = testInputDir, outputDir = testOutputDir) {
    const inputDirPath = join(currentPath, inputDir);
    try {
        await stat(inputDirPath);
    }
    catch (error) {
        console.error('worker输入目录不存在');
        return;
    }
    const outputDirPath = join(currentPath, outputDir);
    try {
        await stat(outputDirPath);
    }
    catch (error) {
        mkdir(outputDirPath);
    }
    await buildWorkerToAmdFormat(inputDir, outputDir);
    await rewriteAllTempFile(outputDir, outputDir);
    console.info('所有worker文件编译完成');
}
/**
 * 获取所有source源文件名称
 * @param sourcePath
 * @returns
 */
async function readAllWorkerSourceFileName(sourcePath) {
    const filenameArr = await readdir(sourcePath);
    return filenameArr;
}
/**
 * 循环构建所有文件
 * @param inputDir
 * @param outputDir
 */
async function buildWorkerToAmdFormat(inputDir, outputDir) {
    /**
     * rollup构建用到的plugin数组
     */
    const pluginArray = [
        nodeResolve(),
        commonjs(),
        swc({
            swc: {
                jsc: {
                    target: 'esnext',
                },
            },
        }),
    ];
    let bundle = undefined;
    const inputFileNameArray = await readAllWorkerSourceFileName(inputDir);
    for (let index = 0; index < inputFileNameArray.length; index++) {
        const inputFile = inputFileNameArray[index];
        try {
            const outputOption = {
                format: 'amd',
                file: join(currentPath, outputDir, `${inputFile.split('.')[0]}.js`),
            };
            /**
             * create a bundle
             */
            bundle = await rollup({
                input: join(currentPath, inputDir, inputFile),
                plugins: pluginArray,
            });
            const bundleinfo = await bundle.write(outputOption);
            if (bundle) {
                await bundle.close();
            }
        }
        catch (error) {
            console.error(error);
        }
    }
}
/**
 * 重写所有中间文件
 * @param inputDir
 */
async function rewriteAllTempFile(inputDir, outputDir) {
    const tempFileList = [];
    const filenameArr = await readdir(inputDir);
    for (const filename of filenameArr) {
        if (filename.includes('.js')) {
            const filepath = join(inputDir, filename);
            tempFileList.push(filepath);
            console.info(`${filepath}编译完成`);
            await rewriteWorkerFile(filepath, outputDir);
        }
    }
}
/**
 * 重写单个中间文件
 * @param filepath
 * @param outputDir
 */
async function rewriteWorkerFile(filepath, outputDir) {
    const filename = basename(filepath);
    let workerCodeStr = await readFile(filepath, {
        encoding: 'utf-8',
    });
    workerCodeStr = workerCodeStr.replace("define(['exports'], (", 'export default ').replace("'use strict';", '');
    const newWorkerCodeStr = workerCodeStr.substring(0, workerCodeStr.length - 4);
    await writeFile(join(outputDir, filename), newWorkerCodeStr);
}
