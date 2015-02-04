App.controller('reportCtl', ['$scope', '$location', 'anchorScroll', function($scope, $location, anchorScroll) {
    $('#bar-search').show(0);
    clearBDShare();
    var sidebarEventListener = function(){
        $(window).scroll(function(){
            if ($(window).scrollTop()+100 >= $('#foreword').offset().top) {
                $(".navbar-side").css({
                    position: "fixed",
                    top: "100px"
                });
            } else {
                $(".navbar-side").css({
                    position: "absolute",
                    top: "50px"
                });
            }
        });
    };
    $scope.targetTo = function(id) {
        anchorScroll.toView(id, true);
    }
    var stat = {
        person: {
            language: {
                title : {
                    text: '使用语言数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-5', '6-10', '11-50', '51-100', '101-200']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[40706, 6582, 2659, 10, 2]
                    }
                ]
            },
            repoNumber: {
                title : {
                    text: '仓库数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-5', '6-50', '51-200', '>=201']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[27030, 21108, 1687, 134]
                    }
                ]
            },
            repoNumber_nofork: {
                title : {
                    text: '仓库数统计（去除Fork）',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-5', '6-50', '51-200']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[37731, 12107, 121]
                    }
                ]
            },
            code: {
                title : {
                    text: '代码量统计',
                    subtext: '单位：字节',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '字节数',
                        data :['0-1000', '1001-1W', '1W-10W', '10W-100W', '100W-1000W', '>=1000W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[18051, 2819, 8267, 10556, 7648, 2618]
                    }
                ]
            },
            follower: {
                title : {
                    text: '粉丝数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '粉丝数',
                        data :['0-10', '11-30', '31-1000', '1001-5000']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[56578, 2704, 1553, 23]
                    }
                ]
            },
            following: {
                title : {
                    text: '关注数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-10', '11-30', '31-1000', '1001-5000', '>=5001']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[53688, 4848, 2316, 4, 2]
                    }
                ]
            },
            star: {
                title : {
                    text: 'Star数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-5', '6-100', '101-500', '501-1000', '1001-5000', '5001-1W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[40781, 15504, 3890, 511, 169, 3]
                    }
                ]
            }
        },
        repo: {
            star: {
                title : {
                    text: 'Star数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : 'Star数',
                        data :['0-5', '6-100', '101-500', '501-1000', '1001-5000', '5001-1W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '项目数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[215719, 8544, 801, 117, 69, 5]
                    }
                ]
            },
            pullRequest: {
                title : {
                    text: 'PR数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-5', '6-50', '51-500', '>=501']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[223970, 1198, 84, 3]
                    }
                ]
            },
            issue: {
                title : {
                    text: 'Issue数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-5', '6-50', '51-500', '>=501']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[222602, 2399, 248, 6]
                    }
                ]
            },
            code: {
                title : {
                    text: '代码量统计',
                    subtext: '单位：字节',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '字节数',
                        data :['0-1000', '1001-10W', '1W-10W', '10W-100W', '100W-1000W', '>=1000W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '项目数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[70788, 44078, 64037, 31635, 12005, 2712]
                    }
                ]
            },
            branch: {
                title : {
                    text: '分支数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-2', '3-10', '>=11']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[219299, 5715, 241]
                    }
                ]
            }
        },
        org: {
            member: {
                title : {
                    text: '成员数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-3', '4-10', '11-50', '>=51']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[2461, 179, 48, 6]
                    }
                ]
            },
            repoNumber_nofork: {
                title : {
                    text: '仓库数统计（去除Fork）',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-2', '3-10', '11-50', '51-100']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[1141, 684, 193, 19]
                    }
                ]
            },
            star: {
                title : {
                    text: 'Star数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-5', '6-100', '101-500', '501-1000', '1001-5000', '5001-1W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '项目数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[8614, 1102, 173, 34, 28, 1]
                    }
                ]
            },
            pullRequest: {
                title : {
                    text: 'PR数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-5', '6-50', '51-500', '>=501']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[9392, 458, 96, 6]
                    }
                ]
            },
            issue: {
                title : {
                    text: 'Issue数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-5', '6-50', '51-500', '>=501']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[9255, 559, 127, 11]
                    }
                ]
            },
            branch: {
                title : {
                    text: '分支数统计',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data :['0-2', '3-10', '>=11']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '人数'
                    }
                ],
                series : [
                    {
                        name:'语言数',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top'
                                }
                            }
                        },
                        data:[9163, 716, 73]
                    }
                ]
            }
        }
    };
    var comp = {
        person: {
            language: {
                title : {
                    text: '使用语言数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-10', '11-50', '51-100', '101-200']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [81.479, 13.175, 5.322, 0.02, 0.004]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [81.395, 14.065, 4.523, 0.015, 0.002]
                    }
                ]
            },
            repoNumber: {
                title : {
                    text: '仓库数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-50', '51-200', '>=201']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [54.104, 42.251, 3.377, 0.268]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [58.855, 38.395, 2.645, 0.105]
                    }
                ]
            },
            repoNumber_nofork: {
                title : {
                    text: '仓库数对比（去除Fork）',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-50', '51-200']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [75.524, 24.234, 0.242]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [72.526, 26.964, 0.511]
                    }
                ]
            },
            code: {
                title : {
                    text: '代码量对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '字节数',
                        data : ['0-1000', '1001-1W', '1W-10W', '10W-100W', '100W-1000W', '>=1000W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [36.132, 5.643, 16.548, 21.129, 15.309, 5.24]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [33.807, 6.868, 18.75, 23.196, 13.535, 3.844]
                    }
                ]
            },
            star: {
                title : {
                    text: 'Star数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-100', '101-500', '501-1000', '1001-5000', '5001-1W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [67.01, 25.476, 6.392, 0.84, 0.278, 0.005]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [80.091, 16.798, 2.778, 0.25, 0.08, 0.002, 0.0]
                    }
                ]
            }
        },
        repo: {
            star: {
                title : {
                    text: 'Star数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : 'Star数',
                        data : ['0-5', '6-100', '101-500', '501-1000', '1001-5000', '5001-1W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [95.767, 3.793, 0.356, 0.052, 0.031, 0.002]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [93.881, 5.472, 0.507, 0.081, 0.054, 0.004, 0.001]
                    }
                ]
            },
            pullRequest: {
                title : {
                    text: 'PR数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-50', '51-500', '>=501']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [99.43, 0.532, 0.037, 0.001]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [98.485, 1.4, 0.112, 0.003]
                    }
                ]
            },
            issue: {
                title : {
                    text: 'Issue数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-50', '51-500', '>=501']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [98.822, 1.065, 0.11, 0.003]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [97.365, 2.364, 0.263, 0.008]
                    }
                ]
            },
            code: {
                title : {
                    text: '代码量对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '字节数',
                        data : ['0-1000', '1001-1W', '1W-10W', '10W-100W', '100W-1000W', '>=1000W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [31.426, 19.568, 28.429, 14.044, 5.33, 1.204]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [26.144, 25.486, 32.213, 12.073, 3.33, 0.753]
                    }
                ]
            },
            branch: {
                title : {
                    text: '分支数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
                legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-2', '3-10', '>=11']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [97.356, 2.537, 0.107]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [95.816, 3.909, 0.275]
                    }
                ]
            }
        },
        org: {
            member: {
                title : {
                    text: '成员数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-3', '4-10', '11-50', '>=51']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [91.351, 6.644, 1.782, 0.223]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [88.958, 8.592, 2.317, 0.132]
                    }
                ]
            },
            repoNumber_nofork: {
                title : {
                    text: '仓库数对比（去除Fork）',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-2', '3-10', '11-50', '51-100']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [56.014, 33.579, 9.475, 0.933]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [53.085, 33.118, 12.53, 1.267]
                    }
                ]
            },
            star: {
                title : {
                    text: 'Star数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-100', '101-500', '501-1000', '1001-5000', '5001-1W']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [86.555, 11.073, 1.738, 0.342, 0.281, 0.01]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [85.307, 12.571, 1.563, 0.268, 0.25, 0.027, 0.013]
                    }
                ]
            },
            pullRequest: {
                title : {
                    text: 'PR数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-50', '51-500', '>=501']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [94.373, 4.602, 0.965, 0.06]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [90.833, 7.527, 1.512, 0.128]
                    }
                ]
            },
            issue: {
                title : {
                    text: 'Issue数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-50', '51-500', '>=501']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [92.996, 5.617, 1.276, 0.111]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [90.289, 7.859, 1.729, 0.123]
                    }
                ]
            },
            branch: {
                title : {
                    text: '分支数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-2', '3-10', '>=11']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [92.072, 7.195, 0.734]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [86.944, 11.246, 1.81]
                    }
                ]
            },
            pullRequest: {
                title : {
                    text: 'PR数对比',
                    subtext: '',
                  x: 'center'
                },
                tooltip : {
                    trigger: 'axis'
                },
              legend: {
                    data:['中国','美国'],
                y: '10%'
                },
                toolbox: {
                    show : true,
                    feature : {
                        saveAsImage : {show: true}
                    }
                },
                calculable : true,
                xAxis : [
                    {
                      type : 'category',
                      name : '个数',
                        data : ['0-5', '6-50', '51-500', '>=501']
                  }
                ],
                yAxis : [
                    {
                        type : 'value',
                      name: '百分比'
                    }
                ],
                series : [
                    {
                        name:'中国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [99.43, 0.532, 0.037, 0.001]
                    },
                   {
                        name:'美国',
                        type:'bar',
                        itemStyle: {
                            normal: {
                                label : {
                                    show: true, position: 'top',
                                  formatter: '{c}%'
                                }
                            }
                        },
                        data: [98.485, 1.4, 0.112, 0.003]
                    }
                ]
            }
        }
    };
    var otherGraph = {
        overview : {
            title : {
                text: '人数和仓库增长速度',
              x:'center'
            },
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:['每月新增用户','每月新增仓库'],
              y:'10%'
            },
            toolbox: {
                show : true,
                feature : {

                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                  axisLabel :{
                    rotate: '-60'
                  },
                    data : ['2008.2', '2008.3', '2008.4', '2008.5', '2008.6', '2008.7', '2008.8', '2008.9', '2008.10', '2008.11', '2008.12', '2009.1', '2009.2', '2009.3', '2009.4', '2009.5', '2009.6', '2009.7', '2009.8', '2009.9', '2009.10', '2009.11', '2009.12', '2010.1', '2010.2', '2010.3', '2010.4', '2010.5', '2010.6', '2010.7', '2010.8', '2010.9', '2010.10', '2010.11', '2010.12', '2011.1', '2011.2', '2011.3', '2011.4', '2011.5', '2011.6', '2011.7', '2011.8', '2011.9', '2011.10', '2011.11', '2011.12', '2012.1', '2012.2', '2012.3', '2012.4', '2012.5', '2012.6', '2012.7', '2012.8', '2012.9', '2012.10', '2012.11', '2012.12', '2013.1', '2013.2', '2013.3', '2013.4', '2013.5', '2013.6', '2013.7', '2013.8', '2013.9', '2013.10', '2013.11', '2013.12', '2014.1', '2014.2', '2014.3', '2014.4', '2014.5', '2014.6', '2014.7', '2014.8', '2014.9', '2014.10', '2014.11', '2014.12']
                }
            ],
            yAxis : [
                {
                    type : 'value',
                }
            ],
          series : [
            {

              symbol:'none',


                    name:'每月新增用户',
                    type:'line',
                    data:[10, 19, 57, 48, 48, 37, 58, 45, 43, 70, 98, 67, 100, 126, 140, 107, 96, 136, 110, 140, 123, 134, 174, 174, 146, 198, 234, 234, 198, 289, 295, 288, 326, 416, 497, 454, 372, 474, 689, 542, 736, 581, 619, 744, 644, 1069, 889, 765, 1085, 1255, 990, 999, 871, 1256, 1402, 1129, 1093, 1189, 1407, 2584, 1178, 2008, 1762, 1731, 1295, 1556, 1585, 1398, 1309, 1343, 1206, 992, 955, 1406, 1427, 1333, 1276, 1458, 1199, 1258, 1512, 1241, 1022],
                },
                {
                  symbol:'none',
                    name:'每月新增仓库',
                    type:'line',
                    data:[1, 2, 9, 9, 33, 12, 17, 40, 23, 38, 58, 47, 65, 103, 108, 92, 101, 111, 116, 132, 103, 148, 165, 140, 129, 178, 184, 182, 186, 240, 288, 309, 289, 359, 439, 456, 415, 572, 636, 690, 703, 739, 774, 956, 854, 1187, 1285, 1167, 1547, 2133, 1857, 1968, 1735, 2496, 2714, 2735, 2790, 3366, 3468, 4098, 2917, 5159, 5296, 5703, 4927, 5517, 6043, 5685, 5644, 6265, 6745, 6105, 5737, 8192, 8499, 8758, 8508, 9833, 10048, 9970, 11685, 12200, 12043],
                }
            ],
            theme : "blue"
        },
        lang_rank_cn: {
            title : {
                text: 'GitHub中国用户使用语言情况',
                subtext: '人数(个)',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : '5%',
                y : '20%',
                data:[ 'JavaScript', 'CSS', 'Java', 'Shell', 'Python', 'C', 'C++', 'Ruby', 'Objective-C', 'PHP', '其他' ]
            },
            toolbox: {
                show : true,
                feature : {
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'语言数',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[ { name: 'JavaScript', value: 60404 },
                          { name: 'CSS', value: 38853 },
                          { name: 'Java', value: 29443 },
                          { name: 'Shell', value: 26160 },
                          { name: 'Python', value: 24926 },
                          { name: 'C', value: 23163 },
                          { name: 'C++', value: 20543 },
                          { name: 'Ruby', value: 17952 },
                          { name: 'Objective-C', value: 15050 },
                          { name: 'PHP', value: 13804 },
                          { name: '其他', value: 67366 }],
                    itemStyle:{
                    normal:{
                          label:{
                            show: true,
                            formatter: '{b} : ({d}%)'
                          },
                          labelLine :{show:true}
                        }
                    }
                }
            ],
            theme: "macarons"
        },
        lang_rank_us: {
            title : {
                text: 'GitHub美国用户使用语言情况',
                subtext: '人数(个)',
                x:'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                orient : 'vertical',
                x : '5%',
                y : '20%',
                data:[ 'JavaScript', 'CSS', 'Ruby', 'Python', 'Shell', 'Java', 'PHP', 'C', 'C++', 'CoffeeScript', '其他' ]
            },
            toolbox: {
                show : true,
                feature : {
                    saveAsImage : {show: true}
                }
            },
            calculable : true,
            series : [
                {
                    name:'语言数',
                    type:'pie',
                    radius : '55%',
                    center: ['50%', '60%'],
                    data:[ { name: 'JavaScript', value: 287633 },
                      { name: 'CSS', value: 175309 },
                      { name: 'Ruby', value: 154022 },
                      { name: 'Python', value: 103961 },
                      { name: 'Shell', value: 95774 },
                      { name: 'Java', value: 71396 },
                      { name: 'PHP', value: 62874 },
                      { name: 'C', value: 54330 },
                      { name: 'C++', value: 45595 },
                      { name: 'CoffeeScript', value: 44214 },
                      { name: '其他', value: 269579 }],
                    itemStyle:{
                    normal:{
                          label:{
                            show: true,
                            formatter: '{b} : ({d}%)'
                          },
                          labelLine :{show:true}
                        }
                    }
                }
            ],
            theme: "macarons"
        }
    };
    var isRemote = IsRemote();
    if (isRemote) {
        rowWidth = window.innerWidth;
        $(".navbar-side").css('display','none')
    } else {
        rowWidth = $('#stat_person_code').width();
        sidebarEventListener();
    }
    var person = [
        {"name":"language","type":"bar"},
        {"name":"code","type":"bar"},
        {"name":"repoNumber","type":"bar"},
        {"name":"repoNumber_nofork","type":"bar"},
        {"name":"follower","type":"bar"},
        {"name":"star","type":"bar"},
        {"name":"following","type":"bar"}
    ];
    var repo = [
        {"name":"star","type":"bar"},
        {"name":"pullRequest","type":"bar"},
        {"name":"issue","type":"bar"},
        {"name":"code","type":"bar"},
        {"name":"branch","type":"bar"}
    ];
    var org = [
        {"name":"member","type":"bar"},
        {"name":"repoNumber_nofork","type":"bar"},
        {"name":"star","type":"bar"},
        {"name":"pullRequest","type":"bar"},
        {"name":"issue","type":"bar"},
        {"name":"branch","type":"bar"}
    ];
    var other = [
        {"name":"overview","type":"line"},
        {"name":"lang_rank_cn","type":"pie"},
        {"name":"lang_rank_us","type":"pie"},
    ]
    var comp_person = [
        {"name":"language","type":"bar"},
        {"name":"repoNumber","type":"bar"},
        {"name":"repoNumber_nofork","type":"bar"},
        // {"name":"code","type":"bar"},
        {"name":"star","type":"bar"}
    ];
    var comp_repo = [
        {"name":"star","type":"bar"},
        {"name":"pullRequest","type":"bar"},
        {"name":"issue","type":"bar"},
        {"name":"code","type":"bar"},
        {"name":"branch","type":"bar"}
    ];
    var comp_org = [
        {"name":"member","type":"bar"},
        {"name":"repoNumber_nofork","type":"bar"},
        {"name":"star","type":"bar"},
        {"name":"pullRequest","type":"bar"},
        {"name":"issue","type":"bar"},
        {"name":"branch","type":"bar"}
    ];
    // for (var i in comp.org) {
    //     comp_org.push({
    //         name: i,
    //         type: comp.org[i].series[0].type
    //     });
    // }
    // console.log(JSON.stringify(comp_org));
    // for (var i=0,l=other.length;i<l;i++) {
    //     $("#"+other[i].name).width(rowWidth*2).height(rowWidth/3*2);
    //     drawChart(other[i].name, otherGraph[other[i].name], other[i].type, otherGraph[other[i].name].theme);
    //     if (isRemote) {
    //         $("#"+other[i].name).css("margin-left", "-40px");
    //     }
    // }
    for (var i=0,l=person.length;i<l;i++) {
        $("#stat_person_"+person[i].name).width(rowWidth).height(rowWidth/3*2);
        drawChart("stat_person_"+person[i].name, stat.person[person[i].name], person[i].type, "blue");
        if (isRemote) {
            $("#stat_person_"+person[i].name).css("margin-left", "-40px");
        }
    }
    for (var i=0,l=repo.length;i<l;i++) {
        $("#stat_repo_"+repo[i].name).width(rowWidth).height(rowWidth/3*2);
        drawChart("stat_repo_"+repo[i].name, stat.repo[repo[i].name], repo[i].type, "default");
        if (isRemote) {
            $("#stat_repo_"+repo[i].name).css("margin-left", "-40px");
        }
    }
    for (var i=0,l=org.length;i<l;i++) {
        $("#stat_org_"+org[i].name).width(rowWidth).height(rowWidth/3*2);
        drawChart("stat_org_"+org[i].name, stat.org[org[i].name], org[i].type, "green");
        if (isRemote) {
            $("#stat_org_"+org[i].name).css("margin-left", "-40px");
        }
    }
    for (var i=0,l=comp_person.length;i<l;i++) {
        if (isRemote) {
            $("#comp_person_"+comp_person[i].name).width(rowWidth).height(rowWidth);
            $("#comp_person_"+comp_person[i].name).css("margin-left", "-40px");
        } else {
            $("#comp_person_"+comp_person[i].name).width(rowWidth*3/2).height(rowWidth/2);
        }
        drawChart("comp_person_"+comp_person[i].name, comp.person[comp_person[i].name], comp_person[i].type, "green");
    }
    for (var i=0,l=comp_repo.length;i<l;i++) {
        if (comp_repo[i].name == "code" || comp_repo[i].name == "branch") {
            $("#comp_repo_"+comp_repo[i].name).width(rowWidth).height(rowWidth/3*2);
        } else {
            if (isRemote) {
                $("#comp_repo_"+comp_repo[i].name).width(rowWidth).height(rowWidth);
            } else {
                $("#comp_repo_"+comp_repo[i].name).width(rowWidth*3/2).height(rowWidth/2);
            }
        }
        drawChart("comp_repo_"+comp_repo[i].name, comp.repo[comp_repo[i].name], comp_repo[i].type, "default");
        if (isRemote) {
            $("#comp_repo_"+comp_repo[i].name).css("margin-left", "-40px");
        }
    }
    for (var i=0,l=comp_org.length;i<l;i++) {
        if (comp_org[i].name == "star" || comp_org[i].name == "branch") {
            if (isRemote) {
                $("#comp_org_"+comp_org[i].name).width(rowWidth).height(rowWidth);
            } else {
                $("#comp_org_"+comp_org[i].name).width(rowWidth * 3/2).height(rowWidth/3*2);
            }
            drawChart("comp_org_"+comp_org[i].name, comp.org[comp_org[i].name], comp_org[i].type, "default");
        } else {
            $("#comp_org_"+comp_org[i].name).width(rowWidth).height(rowWidth/3*2);
            drawChart("comp_org_"+comp_org[i].name, comp.org[comp_org[i].name], comp_org[i].type, "default");
        }
        if (isRemote) {
            $("#comp_org_"+comp_org[i].name).css("margin-left", "-40px");
        }
    }
    //window._bd_share_config={"common":{"bdSnsKey":{},"bdText":"我正在#GitHuber.info#看2014年GitHub中国开发者年度报告，你也来看看吧 @GitHuber_info","bdMini":"1","bdMiniList":["weixin","tsina","qzone","sqq","douban","renren","huaban","youdao","mail","linkedin","copy"],"bdPic":"http://staticfile00.b0.upaiyun.com/report_share.png","bdStyle":"0","bdSize":"16"},"slide":{"type":"slide","bdImg":"0","bdPos":"right","bdTop":"150.5"}};with(document)0[(getElementsByTagName('head')[0]||body).appendChild(createElement('script')).src='http://bdimg.share.baidu.com/static/api/js/share.js?v=89860593.js?cdnversion='+~(-new Date()/36e5)];
}]);
