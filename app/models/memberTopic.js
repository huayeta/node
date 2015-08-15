var mongoose=require('mongoose');
var memberTopicSchema=require('../schemas/memberTopic');

var memberTopic=mongoose.model('member_topic',memberTopicSchema);

module.exports=memberTopic;