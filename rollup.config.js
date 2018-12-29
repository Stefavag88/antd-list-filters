import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { uglify } from 'rollup-plugin-uglify';
import { terser } from "rollup-plugin-terser";

const NODE_ENV = process.env.NODE_ENV || "development";
const outputFileCJS = NODE_ENV === "production" ? "./dist/cjs/prod.js" : "./dist/cjs/dev.js";
const outputFileES = NODE_ENV === "production" ? "./dist/es/prod.js" : "./dist/es/dev.js";
const doUglify = (useTerser) => {
    
    return NODE_ENV === "production"
        ? useTerser 
            ? terser()
            : uglify()
        : null;
} 
// const defaultPlugins = [
//     peerDepsExternal({
//         includeDependencies: true
//     }),
//     postcss({
//         modules: true, 
//         extract: true, 
//         extensions: ['.css', '.scss', '.less'],
//         use : [
//             ['less', { javascriptEnabled: true }]
//         ]
//     }),
//     replace({
//         "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
//     }),
//     babel({
//         exclude: "node_modules/**"
//     }),
//     resolve(),
//     commonjs()
// ]

// rollup.rollup({
//     input: "./src/index.js",
//     plugins: [...defaultPlugins, doUglify(true)]
// }).then(bundle => {
//     bundle.write({
//       format: 'esm',
//       dest: outputFileES
//     })
// })

// rollup.rollup({
//     input: "./src/index.js",
//     plugins: [...defaultPlugins, doUglify()]
// }).then(bundle => {
//     bundle.write({
//       format: 'cjs',
//       dest: outputFileCJS
//     })
// })

export default {
    input: "./src/index.js",
    output: [
        {
            file: outputFileES,
            format: "esm",
            exports: 'named'
        }
    ],
    plugins: [
        peerDepsExternal({
            includeDependencies: true
        }),
        postcss({
            modules: true, 
            extract: true, 
            extensions: ['.css', '.scss', '.less'],
            use : [
                ['less', { javascriptEnabled: true }]
            ]
        }),
        replace({
            "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
        }),
        babel({
            exclude: "node_modules/**"
        }),
        resolve(),
        commonjs(), 
        doUglify(true)
    ],
};