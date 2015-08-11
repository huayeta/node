var mongoose=require('mongoose');
var memberChatTopicSchema=require('../schemas/memberChatTopic');

var memberChatTopic=mongoose.model('member_chat_topic',memberChatTopicSchema);

module.exports=memberChatTopic;