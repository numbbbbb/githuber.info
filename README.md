# github-hunter

寻找GitHub上的优秀人才

## 重要内容

安装：

- npm install
- bower install

开发：

- grunt serve
- grunt build

注意：

- 记得更新upyun

关于详细的文档。。。大家都是程序员，对于文档这件事。。。我有时间一定会补上的！

## 清理版本库

由于历史原因，错误的引入一些文件，版本库需要清理。工具: <https://github.com/cmaitchison/git_diet> 

```
# 查找需要清理的对象
./find_fattest_objects.sh

# 删除不需要的对象
# 执行方法
remove_file=(images/guzhang.d18d4737.gif node_modules/*.* bower_components/*.* bower_components/echarts/doc/**/*.* bower_components/echarts/doc/**/*.* bower_components/echarts/*.*  bower_components/echarts/doc/asset/img/*.* .tmp/**/*.* .tmp/*.* bower_components/echarts/doc/slide/img/*.* node_modules/grunt-contrib-imagemin/node_modules/imagemin/node_modules/imagemin-pngquant/node_modules/pngquant-bin/vendor/pngquant bower_components/echarts/doc/asset/img/example/*.* bower_components/echarts/build/source/*.*)

for i in ${remove_file[*]}; do 
  ./purge_objects.sh $i; 
done


# 或者

./find_fattest_objects.sh -n1000 -d -f | xargs purge_objects.sh   #项目库中的对象比较多时，执行比较慢。

# 或者 手动执行

./purge_objects.sh images/guzhang.d18d4737.gif

./purge_objects.sh node_modules/*.* bower_components/*.*

./purge_objects.sh node_modules/**/*.* bower_components/**/*.*

./purge_objects.sh bower_components/echarts/doc/**/*.*

./purge_objects.sh bower_components/echarts/*.*

./purge_objects.sh bower_components/echarts/doc/asset/img/*.*

./purge_objects.sh .tmp/**/*.* .tmp/*.*

./purge_objects.sh bower_components/echarts/doc/slide/img/*.* node_modules/grunt-contrib-imagemin/node_modules/imagemin/node_modules/imagemin-pngquant/node_modules/pngquant-bin/vendor/pngquant bower_components/echarts/doc/asset/img/example/*.* bower_components/echarts/build/source/*.*
# 以及其他的一些杂七杂八的东西
```

## 开源协议

基于[WTFPL](http://en.wikipedia.org/wiki/WTFPL)协议开源。
