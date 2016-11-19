"use strict";

module.exports = function(grunt) {

	require("load-grunt-tasks")(grunt); 

	grunt.initConfig({
		sass: {
			style: {
				files: {
					"build/css/style.css": "sass/style.scss"
				}
			}
		},

		postcss: {
			style: {
				options: {
					processors: [
						require("autoprefixer")({browsers: [
							"last 1 version",
							"last 3 Chrome versions",
							"last 3 Firefox versions",
							"last 3 Opera versions",
							"last 3 Edge versions"
						]}),
						require("css-mqpacker")({
							sort: false
						})
					]
				},
				src: "build/css/*.css"
			}
		},

		browserSync: {
			server: {
				bsFiles: {
					src: [
						"*.html",
						"css/*.css"
					]
				},
				options: {
					server: ".",
					watchTask: true,
					notify: false,
					open: true,
					ui: false
				}
			}
		},

		watch: {
			style: {
				files: ["sass/**/*.{scss,sass}", "js/*.js"],
				tasks: ["sass", "postcss", "babel"],
				options: {
					spawn: false
				}
			}
		},

		babel: {
			options: {
				sourceMap: true,
				presets: ['babel-preset-es2015']
			},
			dist: {
				files: {
					'build/js/main-babel.js': 'js/main.js',
					'build/js/cart-babel.js': 'js/cart.js'
				}
			}
		},

		copy: {
			build: {
				files: [{
					expand: true,
					src: [
						"fonts/**/*",
						"img/**",
						"js/**",
						"*.html",
						"items.json"
					],
					dest: "build"
				}]
			}
		},

		clean: {
			build: ["build"]
		},

		csso: {
			compress: {
				files: {
					"build/css/style.min.css": ["build/css/style.css"]
				}
			}
		},

		uglify: {
			compress: {
				files: {
					"build/js/main-babel.min.js": ["build/js/main-babel.js"],
					"build/js/cart-babel.min.js": ["build/js/cart-babel.js"]
				}
			}
		},

		imagemin: {
			images: {
				options: {
					optimizationlevel: 3
				},
				files: [{
					expand: true,
					src: ["build/img/**/*{.jpg,png,gif}"]
				}]
			}
		},

		svgstore: {
			options: {
				svg: {
					style: "display:none"
				}
			},
			symbols: {
				files: {
					"build/img/symbols.svg": ["img/icons/*svg"]
				}
			}
		},

		svgmin: {
			symbols: {
				files: {
					src: ["build/img/icons/*.svg"]
				}
			}
		}

	});

	grunt.registerTask("serve", ["babel", "browserSync", "watch"]);
	grunt.registerTask("symbols", ["svgmin", "svgstore"]);
	grunt.registerTask("build", [
		"clean",
		"copy",
		"sass",
		"postcss",
		"csso",
		"babel",
		"uglify",
//		"imagemin"
	]);
};
