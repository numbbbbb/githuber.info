define(function() {

var theme = {
    // 榛樿鑹叉澘
    color: [
        '#408829','#68a54a','#a9cba2','#86b379',
        '#397b29','#8abb6f','#759c6a','#bfd3b7'
    ],

    // 鍥捐〃鏍囬
    title: {
        textStyle: {
            fontWeight: 'normal',
            color: '#408829'
        }
    },

    // 鍊煎煙
    dataRange: {
        color:['#1f610a','#97b58d']
    },

    // 宸ュ叿绠�
    toolbox: {
        color : ['#408829','#408829','#408829','#408829']
    },

    // 鎻愮ず妗�
    tooltip: {
        backgroundColor: 'rgba(0,0,0,0.5)',
        axisPointer : {            // 鍧愭爣杞存寚绀哄櫒锛屽潗鏍囪酱瑙﹀彂鏈夋晥
            type : 'line',         // 榛樿涓虹洿绾匡紝鍙€変负锛�'line' | 'shadow'
            lineStyle : {          // 鐩寸嚎鎸囩ず鍣ㄦ牱寮忚缃�
                color: '#408829',
                type: 'dashed'
            },
            crossStyle: {
                color: '#408829'
            },
            shadowStyle : {                     // 闃村奖鎸囩ず鍣ㄦ牱寮忚缃�
                color: 'rgba(200,200,200,0.3)'
            }
        }
    },

    // 鍖哄煙缂╂斁鎺у埗鍣�
    dataZoom: {
        dataBackgroundColor: '#eee',            // 鏁版嵁鑳屾櫙棰滆壊
        fillerColor: 'rgba(64,136,41,0.2)',   // 濉厖棰滆壊
        handleColor: '#408829'     // 鎵嬫焺棰滆壊
    },

    // 缃戞牸
    grid: {
        borderWidth: 0
    },

    // 绫荤洰杞�
    categoryAxis: {
        axisLine: {            // 鍧愭爣杞寸嚎
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: '#408829'
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
                color: '#408829'
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

    timeline : {
        lineStyle : {
            color : '#408829'
        },
        controlStyle : {
            normal : { color : '#408829'},
            emphasis : { color : '#408829'}
        }
    },

    // K绾垮浘榛樿鍙傛暟
    k: {
        itemStyle: {
            normal: {
                color: '#68a54a',          // 闃崇嚎濉厖棰滆壊
                color0: '#a9cba2',      // 闃寸嚎濉厖棰滆壊
                lineStyle: {
                    width: 1,
                    color: '#408829',   // 闃崇嚎杈规棰滆壊
                    color0: '#86b379'   // 闃寸嚎杈规棰滆壊
                }
            }
        }
    },

    map: {
        itemStyle: {
            normal: {
                areaStyle: {
                    color: '#ddd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            },
            emphasis: {                 // 涔熸槸閫変腑鏍峰紡
                areaStyle: {
                    color: '#99d2dd'
                },
                label: {
                    textStyle: {
                        color: '#c12e34'
                    }
                }
            }
        }
    },

    force : {
        itemStyle: {
            normal: {
                linkStyle : {
                    color : '#408829'
                }
            }
        }
    },

    chord : {
        padding : 4,
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
            show: true,        // 榛樿鏄剧ず锛屽睘鎬how鎺у埗鏄剧ず涓庡惁
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: [[0.2, '#86b379'],[0.8, '#68a54a'],[1, '#408829']],
                width: 8
            }
        },
        axisTick: {            // 鍧愭爣杞村皬鏍囪
            splitNumber: 10,   // 姣忎唤split缁嗗垎澶氬皯娈�
            length :12,        // 灞炴€ength鎺у埗绾块暱
            lineStyle: {       // 灞炴€ineStyle鎺у埗绾挎潯鏍峰紡
                color: 'auto'
            }
        },
        axisLabel: {           // 鍧愭爣杞存枃鏈爣绛撅紝璇﹁axis.axisLabel
            textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                color: 'auto'
            }
        },
        splitLine: {           // 鍒嗛殧绾�
            length : 18,         // 灞炴€ength鎺у埗绾块暱
            lineStyle: {       // 灞炴€ineStyle锛堣瑙乴ineStyle锛夋帶鍒剁嚎鏉℃牱寮�
                color: 'auto'
            }
        },
        pointer : {
            length : '90%',
            color : 'auto'
        },
        title : {
            textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                color: '#333'
            }
        },
        detail : {
            textStyle: {       // 鍏朵綑灞炴€ч粯璁や娇鐢ㄥ叏灞€鏂囨湰鏍峰紡锛岃瑙乀EXTSTYLE
                color: 'auto'
            }
        }
    },

    textStyle: {
        fontFamily: '寰蒋闆呴粦, Arial, Verdana, sans-serif'
    }
};

    return theme;
});
