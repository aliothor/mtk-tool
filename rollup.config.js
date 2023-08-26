import { readFile, readdir } from 'node:fs/promises'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import commonjs from '@rollup/plugin-commonjs'

const inputDir = "worker-source"

async function readAllWorkerName(sourcePath) {
  const filenameArr = await readdir(sourcePath)
  return filenameArr.map((i) => {
    return i.split('.')[0]
    // return i
  })
}

async function dynamicConfig() {
  const workerFileList = await readAllWorkerName(inputDir)

  const configArr = workerFileList.map((i) => {
    console.log(`${inputDir}/${i}.ts`);
    return {
      input: `${inputDir}/${i}.ts`,
      plugins: [nodeResolve(), typescript()],
      output: {
        format: 'amd',
        file: `amd-worker/${i}.js`,
      },
    }
  })

  return configArr
}

export default dynamicConfig
