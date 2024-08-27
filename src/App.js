import React, {useState} from 'react';
import api from './services/api';
import {useRef} from 'react';

export default function App(){
  const [base64Imagem,setBase64Imagem] = useState('')
  const [url,setUrl] = useState('')
  const [files, setFiles] = useState([]);

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

  function uploadMultiplos(){
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
          formData.append("files", files[i]);  // Adiciona cada arquivo ao `FormData`
      }

      api.post('/imagem_material', formData,
        {
          headers: {
              "Content-Type": "multipart/form-data"
          } 
        })
      .then((result)=>{
        let response = result.data.response.url
        setUrl(response)
      })
      .catch((err)=>{
        console.log(err)
    })
  }


  //BACKEND MULTIPLOS ARQUIVOS
  // const files = request.files.files;

  // //VERIFICAÇÃO DE LISTA
  // if (!Array.isArray(files)) {
  //   return response.status(400).json({ message: 'Nenhum arquivo enviado!' });
  // }

  // const uploadedFiles = [];

  // files.forEach((file, index) => {
  //   // Aqui você deve decodificar e salvar o arquivo
  //   const buffer = Buffer.from(file.data, 'base64'); // Supondo que o arquivo seja enviado como base64
  //   const filePath = path.join(__dirname, '../../uploads', `${Date.now()}-${index}-${file.name}`);
    
  //   fs.writeFileSync(filePath, buffer);

  //   uploadedFiles.push({
  //     originalname: file.name,
  //     path: filePath,
  //     size: buffer.length,
  //   });
  // });

  // response.json({
  //   message: 'Arquivos salvos com sucesso!',
  //   files: uploadedFiles
  // });

  return(
    <div>
        <h1>SELECIONE UMA IMAGEM</h1>
        <img src={url} height='250px' width='250px'/>
        <br/><br/>
        <input type={'file'} onChange={(e)=>{imageChange(e)}}/>
        <br/><br/>
        <button onClick={uploadImage}>SALVAR</button>
        <br/><br/>

        <input
          type='file'
          id="file"
          multiple={true}
          accept='image/png, image/jpg, image/jpeg'
          ref={inputRef}
          onChange={async (e) => {
              const files = Array.from(e.target.files);
              setFiles((prevFiles) => [
                  ...prevFiles,
                  ...files
              ]);
          }}
          />
          <button onClick={()=> uploadMultiplos()}>Confirmar</button>
    </div>
  )
}
  