htmljs
======

前端乱炖博客的repo。http://www.html-js.com

本站代码仅供参考，缺少配置文件在本地不能运行，基于express，rainbow，sequelize，jade，coffeescript，less，moment等技术和框架。

update:本站代码比较老，比较初级，不建议参考，请不要再 star 这个项目了，哈哈。

约定模式：
==
* 整个系统从数据到最终逻辑分为五层：1.models，2.functions，3.filters，4.routes，5.views
d
各部分的功能：
==
* models，使用sequelize将数据库操作抽象化，使用其规定格式定义数据对象，完全不需要关心数据库的问题。
* functions，在sequelize上又一层操作封装，主要是各种数据操作，将其封装，供不同的routes或者filters调用。
* filters，一些复用route的合集，例如用户检查，权限检查，通用module，总之就是各种抽象。
* routes，逻辑的最顶层，负责请求调度，一个请求经过filters，获取到通用数据，然后进去各自的routes，在routes里调用functions方法操作和获取models定义的数据。然后把数据显示在views上或者直接返回给用户。
* views，在routes里调用，使用数据渲染页面


全局方法：
==
使用封装的几个全局方法可以节省大量重复代码。

* __M 调用方法即可返回一个Model对象，此对象是一个sequelize的model对象，可以直接操作数据库。省去了写初始化配置的代码。
* __F 调用方法即可返回一个function对象，从functions文件夹里寻找。
* __FC 调用此方法，可以给某个function生成一些常用的操作方法：getById，getAll，add，update，count，delete
* __R 未实现，调用方法直接生成常用route，大量节省普通crud的代码量

特点：
==
* 不需要写routes配置，routes是按照controllers中的文件夹和文件结构自动生成的，这样一是不需手写配置，二是方便逻辑分离和维护。
* 无需关心数据库，所有数据的东西都用sequelize来操作。
* 一些全局方法，自动完成冗余代码，减少重复劳动。

其他：
==
* libs 通用的库
* uploads 上传临时文件
* assets 静态文件，使用less直接编译
* run.js 启动
* config.coffee 配置信息
