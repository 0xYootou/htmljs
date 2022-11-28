// 载入模块
var Segment = require('segment').Segment;
// 创建实例
var segment = new Segment();
// 配置，可根据实际情况增删，详见segment.useDefault()方法
segment.useDefault(); // 载入字典，详见dicts目录，或者是自定义字典文件的绝对路径

// 开始分词
console.log(segment.doSegment('这是一个基于Node.js的中文中文分词模块。'));