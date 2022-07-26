import React, {useState} from 'react';
import api from './services/api';

export default function App(){
  const [base64Imagem,setBase64Imagem] = useState('')
  const [url,setUrl] = useState('')

  //SELECIONA ARQUIVO & CHAMA FUNÇÃO CONVERTER BASE64
  async function imageChange(e){
    const file = e.target.files[0]
    const base64 = await converterBase64(file)
    setBase64Imagem(base64)
  }

  //CONVERTE ARQUIVO PARA BASE64
  function converterBase64(file){
    return new Promise((resolve,reject) =>{
      const fileReader = new FileReader()
      fileReader.readAsDataURL(file);

      fileReader.onload = () =>{
        resolve(fileReader.result);
      };

      fileReader.onerror = (error) =>{
        reject(error);
      }
    })
  }

  async function uploadImage(){
    api.post('/imagem_material',
    {
      id:50,
      imagem:base64Imagem
    },
    )
    .then((result)=>{
      let response = result.data.response.url
      setUrl(response)
    })
    .catch((err)=>{
      console.log(err)
    })
  }

  return(
    <div>
        <h1>SELECIONE UMA IMAGEM</h1>
        <img src={url} height='250px' width='250px'/>
        <br/><br/>
        <input type={'file'} onChange={(e)=>{imageChange(e)}}/>
        <br/><br/>
        <button onClick={uploadImage}>SALVAR</button>
        <br/><br/>
    </div>
  )
}
  