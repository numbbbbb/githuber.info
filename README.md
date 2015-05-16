github-hunter
=============

寻找GitHub上的优秀人才

重要内容
=======

安装：

- npm install
- bower install

开发：

- grunt serve
- grunt build

注意：

- 记得更新upyun

关于详细的文档。。。大家都是程序员，对于文档这件事。。。我有时间一定会补上的！

清理版本库
=========

由于历史原因，错误的引入了一下问题，版本库需要清理。工具: <https://github.com/cmaitchison/git_diet> 

```
find_fattest_objects.sh

./purge_objects.sh images/guzhang.d18d4737.gif

./purge_objects.sh node_modules/*.* bower_components/*.*

./purge_objects.sh node_modules/**/*.* bower_components/**/*.*

./purge_objects.sh bower_components/echarts/doc/**/*.*

./purge_objects.sh bower_components/echarts/*.*
# 以及其他的一些杂七杂八的东西
```

# 开源协议
基于[WTFPL](http://en.wikipedia.org/wiki/WTFPL)协议开源。
