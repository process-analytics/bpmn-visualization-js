import serve from 'rollup-plugin-serve'
import livereload from 'rollup-plugin-livereload'
import copy from 'rollup-plugin-copy'

import typescript from 'rollup-plugin-typescript2'
import pkg from './package.json'

export default {
  input: 'src/index.ts',
  output: [
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  external: [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ], plugins: [
    typescript({
      typescript: require('typescript'),
    }),
    serve('dist'),      // index.html should be in root of project
    livereload({
      watch: 'dist',
      verbose: true
    }),
    copy({
      targets: [
        { src: 'src/index.html', dest: 'dist/' }
      ]
    })
  ],
}
