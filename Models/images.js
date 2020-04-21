var Image = new ImageSchema(
    { img: 
        { data: Buffer, contentType: String }
    }
  );
  var Image = mongoose.model('images', ImageSchema);