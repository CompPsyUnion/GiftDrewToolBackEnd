const giftSchema = new mongoose.Schema({
    title: String,
    name: String,
    count: Number
});

const Gift = mongoose.model('Gift', giftSchema);