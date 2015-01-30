define(function() {

var theme = {
    // 榛樿鑹叉澘
    color: [
        '#2ec7c9','#b6a2de','#5ab1ef','#ffb980','#d87a80',
        '#8d98b3','#e5cf0d','#97b552','#95706d','#dc69aa',
        '#07a2a4','#9a7fd1','#588dd5','#f5994e','#c05050',
        '#59678c','#c9ab00','#7eb00a','#6f5553','#c14089'
    ],

    // 鍥捐〃鏍囬
    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#008acd'          // 涓绘爣棰樻枃瀛楅鑹�
        }
    },

    // 鍊煎煙
    dataRange: {
        itemWidth: 15,
        color: ['#5ab1ef','#e0ffff']
    },

    // 宸ュ叿绠�
    toolbox: {
        color : ['#1e90ff', '#1e90ff', '#1e90ff', '#1e90ff'],
        effectiveColor : '#ff4500'
    },

    // 鎻愮ず妗�
    tooltip: {
        backgroundColor: 'rgba(50,50,50,0.5)',     // 鎻愮ず鑳屾櫙棰滆壊锛岄粯璁や负閫忔槑搴︿负0.7鐨勯粦鑹�
        axisPointer : {            // 鍧愭爣杞存寚绀哄櫒锛屽潗鏍囪酱瑙﹀彂鏈夋晥
            type : 'line',         // 榛樿涓虹洿绾匡紝鍙€変负锛�'line' | 'shadow'
            lineStyle : {          // 鐩寸嚎鎸囩ず鍣ㄦ牱寮忚缃�
                color: '#008acd'
            },
            crossStyle: {
                color: '#008acd'
            },
            shadowStyle : {                     // 闃村奖鎸囩ず鍣ㄦ牱寮忚缃�
                color: 'rgba(200,200,200,0.2)'
            }
        }
    },

    // 鍖哄煙缂╂斁鎺у埗鍣�
    dataZoom: {
        dataBackgroundColor: '#efefff',            // 鏁版嵁鑳屾櫙棰滆壊
        fillerColor: 'rgba(182,162,222,0.2)',   // 濉厖棰滆壊
        handleColor: '#008acd'    // 鎵嬫焺棰滆壊
    },

    // 缃戞牸
    grid: {
        borderColor: '#eee'
    },

    // 绫荤洰杞�
    categoryAxis: {
        axisLine: {            // 鍧愭爣杞寸嚎
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: '#008acd'
            }
        },
        splitLine: {           // 鍒嗛殧绾�
            lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                color: ['#eee']
            }
        }
    },

    // 鏁板€煎瀷鍧愭爣杞撮粯璁ゅ弬鏁�
    valueAxis: {
        axisLine: {            // 鍧愭爣杞寸嚎
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: '#008acd'
            }
        },
        splitArea : {
            show : true,
            areaStyle : {
                color: ['rgba(250,250,250,0.1)','rgba(200,200,200,0.1)']
            }
        },
        splitLine: {           // 鍒嗛殧绾�
            lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                color: ['#eee']
            }
        }
    },

    polar : {
        axisLine: {            // 鍧愭爣杞寸嚎
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: '#ddd'
            }
        },
        splitArea : {
            show : true,
            areaStyle : {
                color: ['rgba(250,250,250,0.2)','rgba(200,200,200,0.2)']
            }
        },
        splitLine : {
            lineStyle : {
                color : '#ddd'
            }
        }
    },

    timeline : {
        lineStyle : {
            color : '#008acd'
        },
        controlStyle : {
            normal : { color : '#008acd'},
            emphasis : { color : '#008acd'}
        },
        symbol : 'emptyCircle',
        symbolSize : 3
    },

    // 鏌卞舰鍥鹃粯璁ゅ弬鏁�
    bar: {
        itemStyle: {
            normal: {
                barBorderRadius: 5
            },
            emphasis: {
                barBorderRadius: 5
            }
        }
    },

    // 鎶樼嚎鍥鹃粯璁ゅ弬鏁�
    line: {
        smooth : true,
        symbol: 'emptyCircle',  // 鎷愮偣鍥惧舰绫诲瀷
        symbolSize: 3           // 鎷愮偣鍥惧舰澶у皬
    },

    // K绾垮浘榛樿鍙傛暟
    k: {
        itemStyle: {
            normal: {
                color: '#d87a80',       // 闃崇嚎濉厖棰滆壊
                color0: '#2ec7c9',      // 闃寸嚎濉厖棰滆壊
                lineStyle: {
                    color: '#d87a80',   // 闃崇嚎杈规棰滆壊
                    color0: '#2ec7c9'   // 闃寸嚎杈规棰滆壊
                }
            }
        }
    },

    // 鏁ｇ偣鍥鹃粯璁ゅ弬鏁�
    scatter: {
        symbol: 'circle',    // 鍥惧舰绫诲瀷
        symbolSize: 4        // 鍥惧舰澶у皬锛屽崐瀹斤紙鍗婂緞锛夊弬鏁帮紝褰撳浘褰负鏂瑰悜鎴栬彵褰㈠垯鎬诲搴︿负symbolSize * 2
    },

    // 闆疯揪鍥鹃粯璁ゅ弬鏁�
    radar : {
        symbol: 'emptyCircle',    // 鍥惧舰绫诲瀷
        symbolSize:3
        //symbol: null,         // 鎷愮偣鍥惧舰绫诲瀷
        //symbolRotate : null,  // 鍥惧舰鏃嬭浆鎺у埗
    },

    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#d87a80'
                    }
                }
            },
            emphasis: {                 // 涔熸槸閫変腑鏍峰紡
                areaStyle: {
                    color: '#fe994e'
                }
            }
        }
    },

    force : {
        itemStyle: {
            normal: {
                linkStyle : {
                    color : '#1e90ff'
                }
            }
        }
    },

    chord : {
        itemStyle : {
            normal : {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle : {
                    lineStyle : {
                        color : 'rgba(128, 128, 128, 0.5)'
                    }
                }
            },
            emphasis : {
                borderWidth: 1,
                borderColor: 'rgba(128, 128, 128, 0.5)',
                chordStyle : {
                    lineStyle : {
                        color : 'rgba(128, 128, 128, 0.5)'
                    }
                }
            }
        }
    },

    gauge : {
        axisLine: {            // 鍧愭爣杞寸嚎
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: [[0.2, '#2ec7c9'],[0.8, '#5ab1ef'],[1, '#d87a80']],
                width: 10
            }
        },
        axisTick: {            // 鍧愭爣杞村皬鏍囪
            splitNumber: 10,   // 姣忎唤split缁嗗垎澶氬皯娈�
            length :15,        // 灞炴€ength鎺у埗绾块暱
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: 'auto'
            }
        },
        splitLine: {           // 鍒嗛殧绾�
            length :22,         // 灞炴€ength鎺у埗绾块暱
            lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                color: 'auto'
            }
        },
        pointer : {
            width : 5
        }
    },

    textStyle: {
        fontFamily: '寰蒋闆呴粦, Arial, Verdana, sans-serif'
    }
};

    return theme;
});
