export async function uploadPostPic(picture) {
    const formData = new FormData();
      formData.append("file", picture); 
      formData.append("upload_preset", "the-mk-stack-blog-postPictures");
      formData.append("cloud_name", "the-mk-stack");

    const response = await fetch("https://api.cloudinary.com/v1_1/the-mk-stack/image/upload", {
          method: "POST",
          body: formData
        });

    const data = await response.json();

    const pictureData = {
            path : data.secure_url,
            filename : data.public_id
        };

    const deleteToken = data.delete_token;

    return {
        pictureData,
        deleteToken
    };
}

export async function uploadUserPic(picture) {
    const formData = new FormData();
      formData.append("file", picture); 
      formData.append("upload_preset", "the-mk-stack-blog-userPictures");
      formData.append("cloud_name", "the-mk-stack");

    const response = await fetch("https://api.cloudinary.com/v1_1/the-mk-stack/image/upload", {
          method: "POST",
          body: formData
        });

    const data = await response.json();

    const pictureData = {
            path : data.secure_url,
            filename : data.public_id
        };

    const deleteToken = data.delete_token;

    return {
        pictureData,
        deleteToken
    };
}

export async function deleteUploadIfError(token) {
    const response2 = await fetch("https://api.cloudinary.com/v1_1/the-mk-stack/delete_by_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: token
          })
        });
}
