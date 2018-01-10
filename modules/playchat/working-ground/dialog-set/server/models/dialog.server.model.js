var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DialogsetDialogSchema = new Schema(
{
    dialogset: { type: Schema.ObjectId, ref: 'Dialogset' },
    id: Number,
    input: Schema.Types.Mixed,
    inputRaw: Schema.Types.Mixed,
    output: Schema.Types.Mixed,
    tag: [String],
    parent: Schema.Types.Mixed,
    context: { type: Schema.ObjectId, ref: 'CustomContext' },
    depth: { type: Number, default: 0 },
    groupId: { type: String },
    randomGroupId: { type: String }
});

mongoose.model('DialogsetDialog', DialogsetDialogSchema);
DialogsetDialogSchema.index({ dialogset: 1, input: 1 });
