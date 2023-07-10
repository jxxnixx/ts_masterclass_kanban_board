///// Drag and Drop setUp

import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";

function App() {
  const onDragEnd = () => {};

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div>
        <Droppable droppableId="one">
          {() => (
            <ul>
              <Draggable draggableId="first" index={0}>
                {() => <li>One</li>}
              </Draggable>
              <Draggable draggableId="second" index={1}>
                {() => <li>Two</li>}
              </Draggable>
            </ul>
          )}
        </Droppable>
      </div>
    </DragDropContext>
  )
}

export default App;

// DragDropContext에는 onDragEnd라는 함수가 필수 prop인데,
// 이는 유저가 드래그를 끝낸 시점에 불려지는 함수임.
// 그리고 childeren도 필수로 필요.

// DragDropContext > Droppable > Draggable
// Droppable : 어떤 것을 드롭할 수 있는 영역
// -> 유저가 드롭할 수 있는 영역이 여러 개가 있을 수 있으므로, id 사용, 
// 함수 형태의 children 필요
// Draggable : Droppable 영역 안에서 어떤 것을 드래그할 수 있는 영역
// 함수 형태의 childeren 필요
// 구분을 위한 id, 정렬(sorting)을 위한 index 필요



///// Drag and Drop part 2

// 빈 함수 props에 beautiful-dnd가 주는 특별한 props들을 받아보자
// Droppable 내의 첫 함수 props 이름은 마음대로 지어도 되고
// 그 안에 이미 여러가지 props들을 갖고 있음. 그걸 사용하면 되지롱

// draggableProps : 어느 위치에서든 드래그가 가능하도록
// dragHandleProps : 내가 지정하는 위치에서만 드래그가 가능하도록 ex)모서리

function App() {
    const onDragEnd = () => {};
    // 이 상태로라면, 우리가 드롭이 끝났을 때 아무것도 하지 않았으므로,
    // 드롭한 순간 맨 처음 상태로 돌아감.
  
    return (
      <DragDropContext onDragEnd={onDragEnd}>
        <div>
          <Droppable droppableId="one">
            {(magic) => (
              <ul ref = {magic.innerRef} {...magic.droppableProps}>
                <Draggable draggableId="first" index={0}>
                  {(magic) => 
                  <li ref = {magic.innerRef} 
                    {...magic.draggableProps}
                    {...magic.dragHandleProps}
                    // 이렇게 handleProps를 그냥 사용하면
                    // 해당 li의 어디에서든 드래그 가능
                  >
                    One
                  </li>}
                </Draggable>
                <Draggable draggableId="second" index={1}>
                {(magic) => 
                  <li ref = {magic.innerRef} 
                    {...magic.draggableProps}
                    {...magic.dragHandleProps}
                  >
                    two
                  </li>}
                </Draggable>
              </ul>
            )}
          </Droppable>
        </div>
      </DragDropContext>
    )
  }

// 지정한 곳에서만 드래그하기

<Draggable draggableId="first" index={0}>
{(magic) => 
<li ref = {magic.innerRef} 
  {...magic.draggableProps}>
    <span {...magic.dragHandleProps}>🔥</span>
    {/* // 이렇게 바꿔주면, span에서 지정한 곳에서만 드래그 가능 */}
  One
</li>}
</Draggable>


///// styles and placeholders

// css, array
// placeholder : 리스트에서 요소를 빼내더라도 보드의 사이즈가 그대로 유지될 수 있도록!

// styled.ts

import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    bgColor : string;
    boardColor: string;
    cardColor: string;
  }
}

// theme.ts

export const darkTheme : DefaultTheme = {
  bgColor: "#3F8CF2",
  boardColor: "#DADFE9",
  cardColor: "white",
};


// App.tsx

import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  max-width: 480px;
  width: 100%;
  margin: 0 auto;
  justify-content: center;
  aCardgn-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: grid;
  width: 100%;
  grid-template-columns: repeat(1, 1fr);
`;

const Board = styled.div`
  padding: 20px 10px;
  padding-top: 30px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
`;

const Card = styled.div`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
`;

const toDos = ["a", "b", "c", "d", "e", "f"];

function App() {
  const onDragEnd = () => {};
  // 이 상태로라면, 우리가 드롭이 끝났을 때 아무것도 하지 않았으므로,
  // 드롭한 순간 맨 처음 상태로 돌아감.

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        <Boards>
          <Droppable droppableId="one">
            {(magic) => (
              <Board ref={magic.innerRef} {...magic.droppableProps}>
                {toDos.map((toDo, index) => (
                  <Draggable draggableId={toDo} index={index}>
                    {(magic) => (
                      <Card
                        ref={magic.innerRef}
                        {...magic.dragHandleProps}
                        {...magic.draggableProps}
                      >
                        {toDo}
                      </Card>
                    )}
                  </Draggable>
                ))}
                {magic.placeholder}
              </Board>
            )}
          </Droppable>
        </Boards>
      </Wrapper>
    </DragDropContext>
  )
}

// index.tsx

import React from "react";
import ReactDOM from "react-dom";
import { RecoilRoot } from "recoil";
import { ThemeProvider } from "styled-components";
import App from "./App";
import { darkTheme } from "./theme";

import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css2?family=Source+Sans+Pro:wght@300;400&display=swap');
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, menu, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
main, menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}
/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, main, menu, nav, section {
  display: block;
}
/* HTML5 hidden-attribute fix for newer browsers */
*[hidden] {
    display: none;
}
body {
  line-height: 1;
}
menu, ol, ul {
  list-style: none;
}
blockquote, q {
  quotes: none;
}
blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}
table {
  border-collapse: collapse;
  border-spacing: 0;
}
* {
  box-sizing: border-box;
}
body {
  font-weight: 300;
  font-family: 'Source Sans Pro', sans-serif;
  background-color:${(props) => props.theme.bgColor};
  color:black;
  line-height: 1.2;
}
a {
  text-decoration:none;
  color:inherit;
}
`;

ReactDOM.render(
  <React.StrictMode>
    <RecoilRoot>
      <ThemeProvider theme={darkTheme}>
        <GlobalStyle />
        <App />
      </ThemeProvider>
    </RecoilRoot>
  </React.StrictMode>,
  document.getElementById("root")
);

///// Reordering

// 아이템을 드롭했을 때 재정렬해보자!

const onDragEnd = (args : any) => {
  console.log(args);
};
// onDragEnd 함수는 어떤 일이 일어났는지에 대한 정보로 
// 많은 argument를 제공함! 아주 굿굿
// 이렇게 해 두면 그 args를 전부 볼 수 있지롱.
// ex ) 드래그한 대상 draggableId, 드롭한 위치 destination 등등...
// args : any를 사용해 ts에서 제외시키기!

<Board ref={magic.innerRef} {...magic.droppableProps}>
                {toDos.map((toDo, index) => (
                  <Draggable key={index} draggableId={toDo} index={index}> 
                  {/* 여기 key 추가해주기! */}
                    {(magic) => (
                      <Card
                        ref={magic.innerRef}
                        {...magic.dragHandleProps}
                        {...magic.draggableProps}
                      >
                        {toDo}
                      </Card>
                    )}
                  </Draggable>
                ))}
                {magic.placeholder}
              </Board>


const onDragEnd = ({destination, source} : DropResult) => {
  // source.index : 최근에 움직여진 item의 index. 어디서 왔는지!
  // destination.index : item을 이동시킬 위치의 index. 어디로 가는지!
  // 만약 s.i가 2라면, index가 2인 item을 그 위치에서 지우고
  // d.i 를 살펴본 후, 우리가 방금 삭제한 걸 그 위치에 추가할 것.

  // x.splice(0,1) : 
  // index 0의 위치로 가서 1개의 item을 삭제하고 아무것도 추가하지 않음.
  // x.splice(2,0,"a") : 
  // index 2에서 시작해서 아무것도 지우지 않고 그 자리에 "a"를 추가.

  // 그런데, splice는 state를 그대로 둔 채로 output만을 변형시키는 것이 아니라
  // state 자체를 변형시킴. mutate라고 하는데, 이는 우리가 원하는 것이 아님.

  // state를 그대로 두고 output만을 변형시키는 예로는,
  // const name = "nico"
  // name.toUpperCase() -> 'nico' 출력
  // 이런 경우가 있음. non-mutation
  // name으로 뭔가를 하긴 했으나, 그 자체는 변하지 않았음.

  // 그러니까 우리는, setToDos를 사용하되, 
  // 현재 state value를 그대로 가져올 수 있는 방법과
  // 현재의 state를 argument로 받아 새로운 값을 리턴하는 함수를 사용하는 방법 중에
  // 현재 state value를 그대로 가져와 복사한 후, 
  // 그 복사본을 변형해 리턴해 줄 것임. 
};

const onDragEnd = ({draggableId, destination, source} : DropResult) => {

  if(!destination) return;

  setToDos((oldToDos) => {
    const copyToDos = [...oldToDos];
    // 1. source.index의 아이템 삭제
    copyToDos.splice(source.index, 1);
    // 2. destination.index의 위치에 아이템 추가
    copyToDos.splice(destination?.index, 0, draggableId);
    // 여기서 draggableId는, 밑에서 찾을 수 있듯이 toDos임.
    // 우리가 선택한 item.
    return copyToDos;
  })
};

// 룰루!

// 근데, 여기 버그가 발생할 수 있는 부분이 있음.
// draggable의 key가 index이고, draggableId가 toDo인 상태인데,
// 이 둘이 같아야 해서 발생하는 것임.
// 그래서 key값을 toDo로 바꿔서 같게 해주자!

<Draggable key={toDo} draggableId={toDo} index={index} ></Draggable>

// 이렇게!
// react에서 우리는 key를 숫자인 index로 주는 것에 익숙하지만, 
// 이 경우에 key와 draggableId는 무조건 같아야 함!

// 하여튼, 최종 코드는

const onDragEnd = ({ draggableId, destination, source }: DropResult) => {
    
  if (!destination) return;
  
  setToDos((oldToDos) => {
    
    const toDosCopy = [...oldToDos];
    
    // 1) Delete item on source.index
    console.log("Delete item on", source.index);
    console.log(toDosCopy);
    toDosCopy.splice(source.index, 1);
    console.log("Deleted item");
    console.log(toDosCopy);
    
    // 2) Put back the item on the destination.index
    console.log("Put back", draggableId, "on ", destination.index);
    toDosCopy.splice(destination?.index, 0, draggableId);
    console.log(toDosCopy);
    
    return toDosCopy;
  });
};


// 이때, item의 위치를 조정하는데 시간이 걸리는 경우엔
// 짧게 text들이 왈랄라 지나가는 경우가 있음.
// 어떨 때는 일어나지 않고 어떨 때는 일어나는데, 
// 그건 react가 Card들을 포함한 Draggable을 전부 리렌더링 하고 있어서 그럼.
// 이제 이걸 고쳐보자!



