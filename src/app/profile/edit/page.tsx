"use client"
import React from 'react'
import { Context } from '@/store/provider'
import MyInput from '@/components/ui-kit/MyInput'
import { STATIC } from '@/http'
import UserService from '@/services/UserService'

export default function ProfileEdit() {
  const { store } = React.useContext(Context)

  const [name, setName] = React.useState<string>('')
  const [surname, setSurname] = React.useState<string>('')
  const [message, setMessage] = React.useState<string>('')

  const [image, setImage] = React.useState("")
  const [selectedImage, setSelectedImage] = React.useState<File>()


  React.useEffect(() => {
    setImage(store.user.avatar ? `${STATIC}${store.user.avatar}` : "")
    setName(store.user.firstname || "")
    setSurname(store.user.lastname || "")
  }, [])




  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0])
      setImage(URL.createObjectURL(event.target.files[0]));
    }
  }
  const ResetImg = () => setImage("")


  const uploadProfile = async () => {
    setMessage('')
    let userAvatar = await store.user.avatar
    // message ? setMessage('') : ""
    try {
      if (selectedImage) {
        const Img = new FormData()
        Img.append("img", selectedImage)
        const response = await UserService.sendImg(Img)
        userAvatar = response.data.fileName
      }

      const update = await UserService.update({
        tg_id: store.user.tg_id,
        firstname: name,
        lastname: surname,
        avatar: userAvatar
      })
      if (update.status == 200) {
        store.setUser(update.data)
        setMessage("Saved")
      }
    } catch (e) {
      console.log(e);
    }

  }

  return (
    <div className='wrap'>
      <div className="profile-edit">
        <div className="profile__photo">
          {!image &&
            <div className="upload_img">
              <input type="file" onChange={onImageChange} id='img-file' />
              <label htmlFor="img-file">
              </label>
            </div>
          }

          {image &&
            <div className="upload_img">
              <img alt="preview image" src={image} />
              <button onClick={ResetImg}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" >
                  <path fillRule="evenodd" clipRule="evenodd" d="M13.7735 4.22702C14.0664 4.51992 14.0664 4.99479 13.7735 5.28768L10.0611 9.0001L13.7734 12.7124C14.0663 13.0053 14.0663 13.4802 13.7734 13.7731C13.4805 14.066 13.0057 14.066 12.7128 13.7731L9.00045 10.0608L5.28824 13.773C4.99535 14.0659 4.52048 14.0659 4.22758 13.773C3.93469 13.4801 3.93469 13.0052 4.22758 12.7123L7.93979 9.0001L4.22748 5.28779C3.93459 4.9949 3.93459 4.52002 4.22748 4.22713C4.52038 3.93424 4.99525 3.93424 5.28814 4.22713L9.00045 7.93944L12.7129 4.22702C13.0058 3.93413 13.4806 3.93413 13.7735 4.22702Z" fill="white" />
                </svg>
              </button>
            </div>
          }
        </div>
        <div className="profile__info">
          <div className="edit-box">
            <p className='edit-heading'>Name</p>
            <div className="input__wrap">
              <MyInput
                value={name}
                onChange={e => setName(e.target.value)} />
            </div>

          </div>
          <div className="edit-box">
            <p className='edit-heading'>Surame</p>
            <div className="input__wrap">
              <MyInput
                value={surname}
                onChange={e => setSurname(e.target.value)} />
            </div>

          </div>

          <button className='big-btn' onClick={uploadProfile}>Save</button>
          {message &&
            <div className="message__box">
              {message}
            </div>
          }
        </div>
      </div>
    </div>
  )
}
