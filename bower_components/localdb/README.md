#localDB

---

[![spm package][spm-image]][spm-url]
[![Build Status][build-image]][build-url]
[![Coverage Status][coverage-image]][coverage-url]
[![MIT License][license-image]][license-url]

**[LocalDB]** 为开发者提供简单、易用又强大的浏览器端数据存取接口，其被设计用来为 WEB 应用、手机 H5 应用、网页游戏引擎提供浏览器端持久化存储方案。

## Feature

*   基于 JSON 文档风格的存储方式
*   支持多种数据格式的存储，例如：函数、正则表达式
*   支持基于文档的富查询及排序功能
*   支持 AMD/CMD/Standalone 等多种模块加载方式
*   支持数据存取加密功能
*   智能存储引擎切换
*   支持域白名单功能，实现跨域共享数据，独特的跨域数据共享解决方案
*   独特的域数据模块化解决方案
*   高安全性(可以通过更改proxy来隐藏数据所存储的真实域)
*   支持 [Promise] 或 Callback 异步编程
*   支持 [BSON] objectId

## Installation

#### By Bower

```bash
$ bower install localdb
```

#### By SPM

```bash
$ spm install localdb
```

通过 [bower] 安装或者直接下载独立库文件的用户，可以直接在html页面中引用该js文件

```html
<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="dist/0.0.1/localdb.js"></script>
</head>
<body>
</body>
<script type="text/javascript">
    var db = new LocalDB("foo")
</script>
</html>
```

LocalDB 支持 [requirejs] 作为其模块加载器，具体用法如下：

```html
<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="emaples/require.js"></script>
</head>
<body>
</body>
<script type="text/javascript">
    require(['dist/0.0.1/localdb'],function(LocalDB){
        var db = new LocalDB("foo")
    }
</script>
</html>
```

LocalDB 支持 [seajs] 作为其模块加载器，通过 [SPM] 安装或者直接下载 seajs 版本的库文件的用户可以利用 [seajs] 来加载 [localDB]

```html
<!DOCTYPE html>
<html>
<head>
    <script type="text/javascript" src="exmaples/sea.js"></script>
</head>
<body>
</body>
<script type="text/javascript">
    seajs.use('localdb-seajs.js', function(LocalDB){
        var db = new LocalDB("foo")
    })
</script>
</html>
```

## Getting Started

```javascript
// 创建/获取名为`foo`的db
var db = new LocalDB("foo")
// 创建/获取该db中名为`bar`的collection
var collection = db.collection("bar")
// 插入数据
collection.insert({
    a: 5,
    b: "abc",
    c: /hell.*ld/,
    d: {e: 4, f: "5"},
    g: function(h){return h*3},
    i: [1,2,3]
}).then(function(err){
    // 查询数据
    // 目前支持添加的数据格式为数字、字符串、正则表达式、对象、函数和数组。
    collection.find({
        // `where`表示查询条件，相当于`select a,b from table where b == "abc"`中的`where`语句。
        where: {
            a: {$gt: 3, $lt: 10},
            b: "abc"
        },
        // `projection`表示根据查询的条件构造选择数据内容。
        projection: {
            a:1,
            b:1
        }
    })
}).then(function(data, err){
    // 其表示更新`a`的值为5的数据，设置其`b`的值为`new_string`，设置其`i`的值为`[3,2,1]`
    collection.update({
        $set: {
            b: "new_string",
            i: [3,2,1]
        }
    },{
        where: {
            a: 5
        }
    })
}).then(function(err){
    // 其表示删除`a`的值大于3、小于10并且不等于5的数据。
    collection.remove({
        where: {
            a: {$gt: 3, $lt: 10, $ne: 5}
        }
    })
})
```

## API Reference

具体的API请参考[这里](http://localdb.emptystack.net)

## Get Involved

1.  [Fork LocalDB](https://github.com/wh1100717/localDB/fork)
    1.  将Fork后的LocalDB项目clone到本地
    2.  命令行执行 `git branch develop-own` 来创建一个新分支
    3.  执行 `git checkout develop` 切换到新创建的分支
    4.  执行 `git remote add upstream https://github.com/wh1100717/localDB.git` 将主干库添加为远端库
    5.  执行 `git remote update` 来更新主干库上的最新代码
    6.  执行 `git fetch upstream/master` 拉取最新代码到本地
    7.  执行 `git rebase upstream/master` 进行本地代码合并
2.  项目根目录执行 `npm install` 安装项目所需要的库和工具
3.  修改源码或者测试用例
3.  执行 `grunt test` 来测试修改的内容是否能跑通所有测试用例
4.  如果测试通过，则将代码提交到remote
5.  在Github你Fork的项目中有一个pull request按钮，点击提交代码合并

## Support Feature

###[Query Operators](http://docs.mongodb.org/manual/reference/operator/query/)

#####Comparison

*   [X] [$gt](http://docs.mongodb.org/manual/reference/operator/query/gt/#op._S_gt)<br>
    Matches values that are greater than the value specified in the query.
*   [X] [$gte](http://docs.mongodb.org/manual/reference/operator/query/gte/#op._S_gte)<br>
    Matches values that are greater than or equal to the value specified in the query.
*   [X] [$lt](http://docs.mongodb.org/manual/reference/operator/query/lt/#op._S_lt)<br>
    Matches values that are less than the value specified in the query.
*   [X] [$lte](http://docs.mongodb.org/manual/reference/operator/query/lte/#op._S_lte)<br>
    Matches values that are less than or equal to the value specified in the query.
*   [X] [$ne](http://docs.mongodb.org/manual/reference/operator/query/ne/#op._S_ne)<br>
    Matches all values that are not equal to the value specified in the query.
*   [X] [$in](http://docs.mongodb.org/manual/reference/operator/query/in/#op._S_in)<br>
    Matches any of the values that exist in an array specified in the query.
*   [X] [$nin](http://docs.mongodb.org/manual/reference/operator/query/nin/#op._S_nin)<br>
    Matches values that do not exist in an array specified to the query.    

#####Logical

*   [X] [$or](http://docs.mongodb.org/manual/reference/operator/query/or/#op._S_or)<br>
    Joins query clauses with a logical **OR** returns all documents that match the conditions of either clause.
*   [X] [$and](http://docs.mongodb.org/manual/reference/operator/query/and/#op._S_and)<br>
    Joins query clauses with a logical **AND** returns all documents that match the conditions of both clauses.
*   [X] [$not](http://docs.mongodb.org/manual/reference/operator/query/not/#op._S_not)<br>
    Inverts the effect of a query expression and returns documents that do not match the query expression.
*   [X] [$nor](http://docs.mongodb.org/manual/reference/operator/query/nor/#op._S_nor)<br>
    Joins query clauses with a logical **NOR** returns all documents that fail to match both clauses.

#####Element

*   [X] [$exists](http://docs.mongodb.org/manual/reference/operator/query/exists/#op._S_exists)<br>
    Matches documents that have the specified field.
*   [X] [$type](http://docs.mongodb.org/manual/reference/operator/query/type/#op._S_type)<br>
    Selects documents if a field is of the specified type.

    >Note: <br>
    >It is different from the **$type** API in MongoDB.<br>
    >It is really easy to determine the type of element in javascript.<br>
    >Support type input string: `string` | `object` | `function` | `array` | `number`

#####Evaluation

*   [X] [$mod](http://docs.mongodb.org/manual/reference/operator/query/mod/#op._S_mod)<br>
    Performs a modulo operation on the value of a field and selects documents with a specified result.
*   [X] [$regex](http://docs.mongodb.org/manual/reference/operator/query/regex/#op._S_regex)<br>
    Selects documents where values match a specified regular expression.
*   [ ] [$text](http://docs.mongodb.org/manual/reference/operator/query/text/#op._S_text)<br>
    Performs text search.
*   [ ] [$where](http://docs.mongodb.org/manual/reference/operator/query/where/#op._S_where)<br>
    Matches documents that satisfy a JavaScript expression.

#####Array

*   [X] [$all](http://docs.mongodb.org/manual/reference/operator/query/all/#op._S_all)<br>
    Matches arrays that contain all elements specified in the query.
*   [X] [$elemMatch](http://docs.mongodb.org/manual/reference/operator/query/elemMatch/#op._S_elemMatch)<br>
    Selects documents if element in the array field matches all the specified **$elemMatch** condition.
*   [X] [$size](http://docs.mongodb.org/manual/reference/operator/query/size/#op._S_size)<br>
    Selects documents if the array field is a specified size.

#####Projection Operators

*   [X] [$](http://docs.mongodb.org/manual/reference/operator/projection/positional/#proj._S_)<br>
    Projects the first element in an array that matches the query condition.
*   [X] [$elemMatch](http://docs.mongodb.org/manual/reference/operator/projection/elemMatch/#proj._S_elemMatch)<br>
    Projects only the first element from an array that matches the specified **$elemMatch** condition.
*   [ ] [$meta](http://docs.mongodb.org/manual/reference/operator/projection/meta/#proj._S_meta)<br>
    Projects the document’s score assigned during **$text** operation.
*   [ ] [$slice](http://docs.mongodb.org/manual/reference/operator/projection/slice/#proj._S_slice)<br>
    Limits the number of elements projected from an array. Supports skip and limit slices.

###[Update Operators](http://docs.mongodb.org/manual/reference/operator/update/)

#####Fields

*   [X] [$inc](http://docs.mongodb.org/manual/reference/operator/update/inc/#up._S_inc)<br>
    Increments the value of the field by the specified amount.
*   [X] [$mul](http://docs.mongodb.org/manual/reference/operator/update/mul/#up._S_mul)<br>
    Multiplies the value of the field by the specified amount.
*   [X] [$rename](http://docs.mongodb.org/manual/reference/operator/update/rename/#up._S_rename)<br>
    Renames a field.
*   [ ] [$setOnInsert](http://docs.mongodb.org/manual/reference/operator/update/setOnInsert/#up._S_setOnInsert)<br>
    Sets the value of a field upon document creation during an upsert. Has no effect on update operations that modify existing documents.
*   [X] [$set](http://docs.mongodb.org/manual/reference/operator/update/set/#up._S_set)<br>
    Sets the value of a field in a document.
*   [X] [$unset](http://docs.mongodb.org/manual/reference/operator/update/unset/#up._S_unset)<br>
    Removes the specified field from a document.
*   [X] [$min](http://docs.mongodb.org/manual/reference/operator/update/min/#up._S_min)<br>
    Only updates the field if the specified value is less than the existing field value.
*   [X] [$max](http://docs.mongodb.org/manual/reference/operator/update/max/#up._S_max)<br>
    Only updates the field if the specified value is greater than the existing field value.
*   [ ] [$currentDate](http://docs.mongodb.org/manual/reference/operator/update/currentDate/#up._S_currentDate)<br>
    Sets the value of a field to current date, either as a Date or a Timestamp.

#####Array
*   [ ] [$](http://docs.mongodb.org/manual/reference/operator/update/positional/#up._S_)<br>
    Acts as a placeholder to update the first element that matches the query condition in an update.
*   [ ] [$addToSet](http://docs.mongodb.org/manual/reference/operator/update/addToSet/#up._S_addToSet)<br>
    Adds elements to an array only if they do not already exist in the set.
*   [ ] [$pop](http://docs.mongodb.org/manual/reference/operator/update/pop/#up._S_pop)<br>
    Removes the first or last item of an array.
*   [ ] [$pullAll](http://docs.mongodb.org/manual/reference/operator/update/pullAll/#up._S_pullAll)<br>
    Removes all matching values from an array.
*   [ ] [$pull](http://docs.mongodb.org/manual/reference/operator/update/pull/#up._S_pull)<br>
    Removes all array elements that match a specified query.
*   [ ] [$pushAll](http://docs.mongodb.org/manual/reference/operator/update/pushAll/#up._S_pushAll)<br>
    Deprecated. Adds several items to an array.
*   [ ] [$push](http://docs.mongodb.org/manual/reference/operator/update/push/#up._S_push)<br>
    Adds an item to an array.

#####Modifiers
*   [ ] [$each](http://docs.mongodb.org/manual/reference/operator/update/each/#up._S_each)<br>
    Modifies the **$push** and **$addToSet** operators to append multiple items for array updates.
*   [ ] [$slice](http://docs.mongodb.org/manual/reference/operator/update/slice/#up._S_slice)<br>
    Modifies the **$push** operator to limit the size of updated arrays.
*   [ ] [$sort](http://docs.mongodb.org/manual/reference/operator/update/sort/#up._S_sort)<br>
    Modifies the **$push** operator to reorder documents stored in an array.
*   [ ] [$position](http://docs.mongodb.org/manual/reference/operator/update/position/#up._S_position)<br>
    Modifies the **$push** operator to specify the position in the array to add elements.

#####Bitwise

*   [ ] [$bit](http://docs.mongodb.org/manual/reference/operator/update/bit/#up._S_bit)<br>
    Performs bitwise **AND**, **OR**, and **XOR** updates of integer values.

#####Isolation
       
*   [ ] [$isolated](http://docs.mongodb.org/manual/reference/operator/update/isolated/#up._S_isolated)<br>
    Modifies behavior of multi-updates to increase the isolation of the operation.


[spm-image]: http://spmjs.io/badge/localdb
[spm-url]: http://spmjs.io/package/localdb
[build-image]: https://api.travis-ci.org/wh1100717/localDB.svg?branch=master
[build-url]: https://travis-ci.org/wh1100717/localDB
[coverage-image]: https://img.shields.io/coveralls/wh1100717/localDB.svg
[coverage-url]: https://coveralls.io/r/wh1100717/localDB?branch=master
[license-image]: http://img.shields.io/badge/license-MIT-blue.svg?style=flat
[license-url]: LICENSE

[LocalDB]: https://github.com/wh1100717/localDB
[requirejs]: http://requirejs.org/
[seajs]: http://seajs.org/docs/
[SPM]: http://spmjs.io/
[bower]: http://bower.io/
[Promise]: https://www.promisejs.org/
[BSON]: http://bsonspec.org/

