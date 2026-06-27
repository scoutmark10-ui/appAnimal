from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from pydantic import BaseModel
from uuid import uuid4

app = FastAPI(
 title = "App Animal API",
 description = "API criada por Zynko para estudos de FastAPI.",
  version = "1.0.0",
  docs_url="/docs",
  redoc_url="/redoc"
)

origins = ['https://app-animal.vercel.app']

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# estrutura de cada animal
class Animal(BaseModel):
  # id opcional igualamos a none
  id: Optional[uuid4] = None
  nome: str
  idade: int
  sexo: str
  cor: str

# banco de dados dos animais
banco: List[Animal] = []

# ver todos animais

@app.get('/animais')
def lista_animais():
  return banco

# obter animal

@app.get('/animais/name')
def encontrar_animal(nome: str):
    encontrados = []

    for animal in banco:
        if animal.nome.lower() == nome.lower():
            encontrados.append(animal)

    if encontrados:
        return {
            "mensagem": "Animal encontrado com sucesso",
            "encontrados": encontrados
        }

    return {
        "mensagem": "Animal não encontrado",
        "encontrados": []
    }

# criar animal

@app.post('/animais')
def criar_animal(animal: Animal):
  # obtemos animais com ids aleatorios
  animal.id = str(uuid4())
  # tipo um push pra mandar o animal para o banco de dados
  banco.append(animal)
  return {
    "mensagem": "Animal criado com sucesso",
    "animal": animal
}

# deletar animal

@app.delete('/animais/{id}')
def remover_animal(id: str):
  posicao = -1
  
  # buscando a posicao do animal
  for index, animal in enumerate(banco):
    if animal.id == id:
      posicao = index
      break

  if posicao != -1:
    banco.pop(posicao)
    return {"mensagem": "Animal removido com sucesso"}
  else:
    return {"erro": "Animal não encontrado"}