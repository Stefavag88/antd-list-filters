import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import postcss from 'rollup-plugin-postcss';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import {uglify} from 'rollup-plugin-uglify';

const NODE_ENV = process.env.NODE_ENV || "development";
const outputFile = NODE_ENV === "production" ? "./dist/prod.js" : "./dist/dev.js";

export default {
    input: "./src/index.js",
    output: {
        file: outputFile,
        name: 'lib.browwser',
        format: "umd",
        exports: 'named'
    },
    plugins: [
        peerDepsExternal({
            includeDependencies: true
        }
        ),
        postcss({
            modules: true, 
            extract: true, 
            extensions: ['.css', '.scss', '.less'],
            use : [
                ['less', { javascriptEnabled: true }]
            ],
        }),
        replace({
            "process.env.NODE_ENV": JSON.stringify(NODE_ENV)
        }),
        babel({
            exclude: "node_modules/**"
        }),
        resolve(),
        commonjs(), 
        uglify({
            
        })
    ],
};