var mongoose=require('mongoose');
var memberTeamSchema=require('../schemas/memberTeam');

var memberTeam=mongoose.model('member_team',memberTeamSchema);

module.exports=memberTeam;