///// 6.7 Performance

// 고치기 전에, 파일을 정리하자.

// react는, 부모 컴포넌트의 state가 바뀌기만 하면
// children들은 전부 리렌더링됨. 그럴 필요가 없는데도!

// 이걸 원하지 않을 때,
// react.memo를 활용함.
// react에게 prop이 바뀌지 않는다면 리렌더링 하지 말라고 하는 것.

// export default React.memo(DraggableCard);

// 이렇게 하면, react에게 prop이 변하지 않는다면 
// DraggableCard를 리렌더링 하지 말라고 말하는 것.

// 이렇게 하고 e와 f의 자리를 바꾸면,
// index가 변화하고 그것은 prop이므로
// e와 f만 리렌더링되고 
// 나머지 아이들은 렌더링되지 않음.

/// Components 폴더를 만들고
// 그 안에 DraggableCard 넣기

import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
`;

interface IDragabbleCardProps {
  toDo: string;
  index: number;
}

function DragabbleCard({ toDo, index }: IDragabbleCardProps) {
  console.log(toDo, "has been rendered");
  return (
    <Draggable key={toDo} draggableId={toDo} index={index}>
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
  );
}

export default React.memo(DragabbleCard);

// App.tsx

<Board ref={magic.innerRef} {...magic.droppableProps}>
{toDos.map((toDo, index) => (
  <DraggableCard key={toDo} index={index} toDo={toDo} />
))}
{magic.placeholder}
</Board>

// 이렇게 변경!


///// 6.8 Multi Boards

// 보드를 여러 개 만들자!

// 그러려면 일단 atom을 수정해서 obj 형태로 만들어 줘야 함.
// toDoState를 수정하자.

import {atom} from "recoil";

export const toDoState = atom({
    key: "toDo",
    default: {
        to_do : ["a", "b"],
        doing : ["c", "d", "e"],
        done : ["f"],
    },
  });

// 여기서 조심할 것은, map은 obj가 아닌 array에서만 사용할 수 있어서,
// board component를 만들어 코드를 바꿔 주자.

// Board.tsx
import { Droppable } from "react-beautiful-dnd";
import styled from "styled-components";
import DraggableCard from "./DraggableCard";

const Wrapper = styled.div`
  padding: 20px 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 200px;
`;

interface IBoardProps {
  toDos: string[];
  boardId: string;
}

function Board({toDos, boardId} : IBoardProps) {
    return (
        <Droppable droppableId={boardId}>
            {(magic) => (
                <Wrapper ref = {magic.innerRef} {...magic.droppableProps}>
                    {toDos.map((toDo, index) => (
                        <DraggableCard key={toDo} index={index} toDo={toDo} />
                    ))}
                    {magic.placeholder}
                </Wrapper>
            )}
        </Droppable>
    );
}

// 이후에, obj들을 loop로 돌려줘야 하는데,
// 각 obj들의 property들을 받아 그 array를 render하고 map을 사용하면 됨.

// object.keys(toDos).map(boardId => toDos[boardId])
// 이런 형식으로!

// App.tsx에서

<DragDropContext onDragEnd={onDragEnd}>
    <Wrapper>
        <Boards>
            {Object.keys(toDos).map((boardId) => (
            <Board boardId={boardId} key={boardId} toDos={toDos[boardId]} />
            ))}
        </Boards>
    </Wrapper>
</DragDropContext>

// object.keys(toDos) -> key들만 출력, 이게 곧 boardId가 됨.
// map과 boardId를 이용해, 그 boardId가 각각 가지는 자식들을 보는 것.
// 즉, boardId를 꺼내다 array안에 넣고, 
// boardId가 있으니까, 그걸 이용해 toDos 내부를 확인하면 됨.

// 여기서, toDos={toDos[boardId] 부분에서 에러가 뜨는데
// 그 이유는 toDos는 string으로 이뤄진 array인데
// toDos boardId는 ts에 의하면 string이 아니기 때문임.

// atoms에서 obj의 형태를 string이 아닌
// to_do, doing, done 세 가지로 설정해뒀기 때문.

// 여기서, 좀 더 확장성을 주기 위해 ts에게 우리의 toDoState가 뭔지 알려주자.
// 왜냐하면 ts는 정말로 우리의 toDoState가 딱 3개의 선택지만 있다고 생각하므로.

// 그런데, 나중에 우리가 user에게 board를 만들 선택권을 줄 가능성도 있으므로
// atoms.tsx에 interface를 사용해
// key와 value의 형태를 제대로 잡아주자.

interface IToDoState {
    [key : string] : string[];
}
// 이 state는 string으로서의 property와, string array로 이루어져 있다고 설정.
// 즉, toDoState에서 이 interface를 사용하지 않으면,
// ts는 주어진 3가지만이 유일한 선택지라고 생각할 것.
// 그러니까 우리의 toDoState가 단지 key이고, string이며,
// value로는 string으로 이루어진 array를 가질 것이라고 설정한 것.

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        to_do : ["a", "b"],
        doing : ["c", "d", "e"],
        done : ["f"],
    },
  });

// 우리는 여기서, reorder의 기능을 잃어버림!
// 이걸 다시 제대로 구현해보자.



//// 6.9 Same Board Movement

// 일단 보드 내에서 움직이는 것부터 구현해 보자.
// 기억해야 하는 것은, 우리가 drop할 때마다 어떤 정보를 얻었는지임.
// 우리가 drop 할 때마다 onDragEnd라는 함수가 실행되고, 
// 그 움직임에 대한 많은 정보를 얻을 것.

// 우리는 boardId를 만들어 prop으로 넣어 줬기 때문에 
// 어떤 board 상에서 움직인 것인지도 
// onDragEnd의 arguments들로 확인할 수 있음.
// 어떤 board의 어떤 위치에서 시작되었고
// 어떤 board의 어떤 위치로 이동되었는지 확인 가능!

// 그러려면 먼저, 현재는 보드 간 이동 말고 한 보드 내에서의 이동만 취급하므로,
// source board가 destination board와 같은지 체크부터 해야 함.
// droppableId를 이용해서!

const onDragEnd = (info: DropResult) => {

    console.log(info);
    const {destination, draggableId, source} = info;

    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];

        // 1) 수정이 일어난 보드만 복사한다.
        // 2) 그 복사본을 기존 items 옆에 붙여 준다.

        // 현재 상태에서 oldToDos는 obj이고, 더 이상 array가 아니니까
        // copy를 [...oldToDos] 이런 형식으로 할 수 없음.
        // 변화가 일어난 board만 복사해 줄 것.

        // 이 경우에는, 우리가 destination과 source의 droppableId가 같다는 걸 아니까
        // 둘 중 아무나 사용할 수 있음.

        // [...oldToDos[source.droppableId]] 이런 식으로 copy.

        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination.index, 0, draggableId);

        return {
          ...allBoards,
          [source.droppableId] : boardCopy,

        // 리턴 시에는, ...oldToDos로 다른 모든 board들을 가져오고,
        // key가 될 새로운 board의 copy를 더해주는 것.

        };
      });
    }
};

// atoms.tsx

export const toDoState = atom<IToDoState>({
    key: "toDo",
    default: {
        "To Do": ["a", "b"],
        Doing: ["c", "d", "e"],
        Done: ["f"],
    },
});

// 이름 조금 변경해주기!

// Board.tsx
// title 추가

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

function Board({toDos, boardId} : IBoardProps) {
    return (
            <Wrapper>
                <Title>{boardId}</Title>  
                <Droppable droppableId={boardId}>
                    {(magic) => (
                        <div ref = {magic.innerRef} {...magic.droppableProps}>
                            {toDos.map((toDo, index) => (
                                <DraggableCard key={toDo} index={index} toDo={toDo} />
                            ))}
                            {magic.placeholder}
                        </div>
                    )}
                </Droppable>
            </Wrapper>
            )
        };

///// 6.10 Cross Board Movement

// 이제 보드 간 이동도 가능하도록 구현해 보자!

// 똑같이 하면 됨. 다만, 이번에는 copy해야 할 board가 2가지씩이겠지.
// splice도 똑같이 하면 되고.
// return 할 때에도, 똑같이 모든 것들을 불러온 다음 복사본을 불러오는 것.

// App.tsx에 보드 간 이동을 위해

if (destination.droppableId !== source.droppableId) {
    setToDos((allBoards) => {
      const sourceBoard = [...allBoards[source.droppableId]];
      const destinationBoard = [...allBoards[destination.droppableId]];

      sourceBoard.splice(source.index, 1);
      destinationBoard.splice(destination?.index, 0, draggableId);

      return {
        ...allBoards,
        [source.droppableId] : sourceBoard,
        [destination.droppableId] : destinationBoard,
      };
    });
}

// 이렇게 추가, 

// 결론적으로 App.tsx의 onDragEnd는 

const onDragEnd = (info: DropResult) => {
    console.log(info);
    const { destination, draggableId, source } = info;
    if (!destination) return;
    if (destination?.droppableId === source.droppableId) {
      // same board movement.
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards,
          [source.droppableId]: boardCopy,
        };
      });
    }
    if (destination.droppableId !== source.droppableId) {
      // cross board movement
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const destinationBoard = [...allBoards[destination.droppableId]];
        sourceBoard.splice(source.index, 1);
        destinationBoard.splice(destination?.index, 0, draggableId);
        return {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: destinationBoard,
        };
      });
    }
  };

// Atoms.tsx에
// 보드 3개에만 국한되지 않는다는 것을 알려주기 위해

"Do Later": ["x", "z"],

// 추가



///// 6.11 Droppable Snapshot

// board를 떠날 때 색상을 바꿔야 할 타이밍과
// destination board에 도착해서 색상을 바꿔야 할 타이밍을 어떻게 정할지 알아보자!

// 그리고 item이 없는 board 위에
// 다른 board로부터 item을 옮길 때,
// board의 최상단 부분에 가져가야 옮겨지고
// 아래 부분에 가져가면 옮겨지지 않는 문제도 해결해 보자.

// 그 부분은 원래 Board.tsx에서 <div> 로 감싸진 부분이었는데

const Area = styled.div`
  background-color : skyblue;
`;
// 를 추가해 준 다음, div를 Area로 바꿈.

// 이제, 드롭 가능한 구역 droppable area를 맨 아래까지 이어지게 설정해
// 위의 문제를 해결해 보자!

// Area의 부모인 Wrapper와 Area를 수정해주면 되지롱

// 맨 아래 2개 추가
const Wrapper = styled.div`
  width: 300px;
  padding: 20px 10px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;

  display: flex;
  flex-direction: column;
`;

// 마지막 요소 추가
const Area = styled.div`
  background-color : skyblue;
  flex-grow: 1;
`;

// 그럼 위 문제는 해결!!

// 이제 내가 board에 도착하는지, board를 떠나는지에 따라 
// area의 색상을 변경해 주자

// Board.tsx의 Droppable component안에
// snapshot 이라는 argument를 설정해서!

// 해당 argument는 여러 내용들을 담고 있음.
// 예를 들면 isDraggingOver, draggingFromThisWith 등등..

<Droppable droppableId={boardId}>
{(magic, snapshot) => ( 
  // snapshot 추가!
    <Area
      isDraggingOver = {snapshot.isDraggingOver} 
      // 예를 들면 isDraggingOver - 유저가 board 위로 드래그해서 들어오고 있는지
      
      isDraggingFromThis = {Boolean(snapshot.draggingFromThisWith)} 
      // draggingFromThisWith - 유저가 해당 board로부터 드래그를 시작했는지, 즉
      // 유저가 어떤 board를 떠난다면, 그 board로부터 drag를 시작했다는 뜻.

      ref = {magic.innerRef}
      {...magic.droppableProps}
    >
        {toDos.map((toDo, index) => (
            <DraggableCard key={toDo} index={index} toDo={toDo} />
        ))}
        {magic.placeholder}
    </Area>
)}
</Droppable>

// 그런데, 이런 argument들은 Area 안에서 사용할 건데,
// 현재 Area는 그냥 div니까 아직 이 prop들을 인식하지 못함.
// 그러니까, styled component에게 isDraggingOver이라는 prop을 받을 거라고
// 말해 주자!
// 이걸 설정해 주면, 우리가 drag해서 board 위로 올라오는지 아닌지에 따라 
// board의 배경색을 바꿀 수 있을 것.

const Area = styled.div<{isDraggingOver : boolean}>`

  background-color : ${(props) => 
    props.isDraggingOver ? "pink" : "blue"};
  flex-grow: 1;
`;

// 이제 isDraggingFromThis도 사용할 건데,
// 그냥 같다붙여도 되지만 그러면 너무 길어지니까
// 아예 interface를 만들어서 Area에 적용시켜 주자!
// 보드를 떠날 때 빨간색, 보드로 들어올 때 핑크색, 기본은 파란색으로 설정하자.
// 그리고 Area에 trasition을 설정해 색상 변화를 부드럽게!

interface IAreaProps {
  isDraggingFromThis : boolean;
  isDraggingOver : boolean;
}

const Area = styled.div<IAreaProps>`

  background-color : ${(props) => 
    props.isDraggingOver ? "pink" : props.isDraggingFromThis ? "red" : "blue"};
  flex-grow: 1;
  transition : background-color 0.3s ease-in-out;
`;

///// 6.12 Final Styles

// isDragging 일 때 카드 색상을 바꿔줄 건데
// 당연히 card는 style component니까 isDragging이라는 prop을 인식할 수 없음
// 따라서 아까 했던 것처럼
// snapshot 추가해 주고, styled component도 수정해 주자

const Card = styled.div<{isDragging : boolean}>`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px;
  background-color: ${(props) =>
    props.isDragging ? "#e4f2ff" : props.theme.cardColor};
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 5px rgba(0, 0, 0, 0.05)" : "none"};
`;

<Draggable draggableId={toDo} index={index}>
      {(magic, snapshot) => (
        <Card
        isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDo}
        </Card>
      )}
    </Draggable>

// 카드를 드래그 할 때는 그림자도 넣어 주고, 
// wrapper의 좌우 padding도 없애 주고, 상하 padding도 바꿔 주고
// 카드의 padding도 바꿔 주고, 색깔도 바꿔 주고
// 보드 배경색도 바꿔 주고..

const Wrapper = styled.div`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Area = styled.div<IAreaProps>`
  background-color : ${(props) => 
    props.isDraggingOver
      ? "#dfe6e9"
      : props.isDraggingFromThis
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition : background-color 0.3s ease-in-out;
  padding: 20px;
`;


///// 6.13 Refs

// 이제 우리가 직접 to do를 추가할 수 있는 form을 만들자!
// 지금까지의 to do는 그냥 atom에 지정해 둔 string일 뿐이지만
// 우리는 유저가 직접 to do를 쓰고 엔터를 쳐서 등록하길 원함.
// 그러려면 우리의 to do를 obj로 바꿔 줘야 하는데, 그건 나중에 하고 
// 일단 reference 에 대해 얘기해 보자!

// ref는 우리의 react 코드를 이용해 HTML 요소를 지정하고 가져올 수 있는 방법
// 즉, JS 로부터 HTML 요소를 가져오고 수정하는 방법

// reference는, 
// react JS component를 통해 HTML 요소를 가져와 그걸 변형할 수 있도록 해줌.
// reference를 만들고, ts에게 그게 무슨 요소인지 말해주고,
// 내가 원하는 요소에게 그 ref를 주면 됨!
// 이렇게 하면 JS와 React.js를 이용해 모든 HTML의 method에 접근할 수 있음.

// ref는 react에 속하지만, 그걸로 하는 모든 행동들이 일반 JS에서 오는 것임.
// HTML method를 불러와 사용할 수도 있잖아ㅇㅇ

const inputRef = useRef<HTMLInputElement>(null);

const onClick = () => {
  inputRef.current?.focus();
  setTimeout(() => {
    inputRef.current?.blur();
  }, 5000);
  // click 버튼 눌렀을 때 input창에 focus 되도록 하고
  // 5초 후에 blur되도록 설정!
};

// 이후 리턴문 안에

<Wrapper>
    <Title>{boardId}</Title> 
    <input ref={inputRef} placeholder="grab me" />
    <button onClick={onClick}>click me</button>

    <Droppable droppableId={boardId}>
        {(magic, snapshot) => (
            <Area
              isDraggingOver = {snapshot.isDraggingOver}
              isDraggingFromThis = {Boolean(snapshot.draggingFromThisWith)}
              ref = {magic.innerRef}
              {...magic.droppableProps}
            >
                {toDos.map((toDo, index) => (
                    <DraggableCard key={toDo} index={index} toDo={toDo} />
                ))}
                {magic.placeholder}
            </Area>
        )}
    </Droppable>
</Wrapper>


///// 6.14 Task Objects

// 이제 진짜 우리의 form을 만들자!
// react-hook-form rhf의 useForm을 이용해서!

import { useForm } from "react-hook-form";

// Form의 interface인 IForm 만들고, useForm에 적용
// useForm의 register, setValue, handleSubmit 이용

interface IForm {
  toDo : string;
}

function Board({toDos, boardId} : IBoardProps) {

  const {register, handleSubmit, setValue } = useForm<IForm>();

  const onValid = ( data : IForm) => {};

}

// form의 styled-component 만들고 return문 안에서 사용해주기
const Form = styled.form`
  width : 100%;
  input {
    width : 100%;
  }
`;

// input 설정하는데, register를 required로!
<Form onSubmit = {handleSubmit(onValid)}>
  <input
    {...register("toDo", {required : true})}
    type = "text"
    placeholder={`Add task on ${boardId}`}
  />
</Form>

// 이후에 form이 valid할 때 호출되는 함수 onValid 를 선언하고,
// IForm 타입의 data 받기.
// rhf의 handleSubmit을 먼저 호출한 후
// Form component에서 onSubmit을 이용해 onValid 호출하고
// 그 안에서 setValue 사용해 console.log로 출력해 보기.

const onValid = ( data : IForm) => {
  console.log(data);
  setValue("toDo", "");
};

// 이제 진짜로 해야 할 것은, data로부터 오는 toDo를 실제로 만드는 건데,
// 이걸 우리 state 안에서 만들어야 함.
// 그러면 atoms.tsx 의 state를 조금 다르게 디자인해야 하는데
// 이걸 위해서는 많은 것을 바꿔 줘야 함.


// 일단 atoms.tsx에 interface인 IToDo를 만들자.

export interface ITodo {
  id : number;
  text : string;
}

interface IToDoState {
  [key : string] : ITodo[];
}

// App.tsx의 IBoardProps에서 toDos를 그냥 string으로 렌더링하고 있는데,
// IToDo의 형태에 따라 그건 더 이상 사실이 아니게 되므로,
// toDos의 타입은 IToDo임.

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
};

// 그리고 모든 props의 형태를 고쳐 주자.
// 우리의 board는 toDos가 그냥 string array라고 생각하는데,
// 이젠 그게 아니라 IToDo들의 array가 됐으므로.

// Board.tsx의 DraggableCard의 key도 obj 형식의 toDo가 될 수는 없으므로,
// toDo.id로 변경.

{toDos.map((toDo, index) => (
  <DraggableCard 
    key={toDo.id} 
    index={index} 
    toDoId={toDo.id}
    toDoText={toDo.text} 
  />
))}

// 또, IDraggableCardProps도 변경, 
// 컴포넌트 DraggableCard props도 변경.
// 우리의 toDo가 더 이상 string이 아닌,
// id와 text를 가지는 obj이기 때문에!

interface IDraggableCardProps {
  toDoId: number;
  toDoText: string;
  index: number;
}

// 함수 DraggableCard가 받는 props도 변경,
// Draggable 컴포넌트의 draggableId도 string이어야 하므로, 
// toDoId를 text로 변환해 주기!

function DraggableCard({ toDoId, toDoText, index }: IDraggableCardProps) {

  return (
    <Draggable draggableId={toDoId + ""} index={index}> //
      {(magic, snapshot) => (
        <Card
        isDragging={snapshot.isDragging}
          ref={magic.innerRef}
          {...magic.dragHandleProps}
          {...magic.draggableProps}
        >
          {toDoText}
        </Card>
      )}
    </Draggable>
  );
}

// 하여튼, 이제 board는 string으로 이루어진 array를 받지 않고,
// IToDo로 이루어진 array를 받게 되는 것.

// 또, App.tsx의 onDragEnd의 draggableId는, 이전에는 ["a","b"] 형태였으므로
// 삭제하고 다시 넣기가 수월했지만,
// 이제 draggableId의 형태는 string이 아닌 obj이기 때문에
// [{"text : "hello", id : "1"}, {"text : "hello", id : "2"}] 이고,
// 삭제하기 전에 우리가 받는 정보는 text가 아닌 id일 뿐이므로,
// 즉 우리가 움직인 카드의 id만을 알 수 있으므로, 제대로 재배열을 할 수가 없음.
// 따라서 삭제하기 전에 그 id를 이용해 text를 찾아 
// 제대로 된 toDo를 한번 저장해주는 과정이 필요함!


///// 6.15 Creating Tasks

// App.tsx를 보면 에러가 뜰 거임. string에서 obj로 변경한 것 때문에.

// 우리가 찾으려는 것은, 뭐가 움직여졌는지임.
// 우리가 정보를 obj로 받지 않고 item이 가진 id로 받아오니까.
// id를 가지고 to do Board 안으로 들어가서 원하는 to do를 받아와야 함.

// 이때 방법이 2가지가 있음.
// 1. id를 이용해 to do 찾기 
// 2. to do가 있는 위치 찾기

// 일단, to do를 받아오자.
// const taskObj = boardCopy[source.index] 를 만들면
// 그 변수가 내가 옮기려고 하는 to do obj 전체를 가져다 줄 것임.

const boardCopy = [...allBoards[source.droppableId]];
const taskObj = boardCopy[source.index];

// 우리는 boardCopy로 보드 정보를 가져오고
// taskObj로 item 정보를 가져옴.
// 그걸 splice에 사용해 목적지에 to do obj를 다시 넣어주는 것.
// 원래는 draggableId 였지만, 그건 string일 때의 이야기고.
        
boardCopy.splice(source.index, 1);
boardCopy.splice(destination?.index, 0, taskObj); // 여기가 원래 draggableId 였음.

// 같은 보드 상에서 item을 움직일 때랑,
// 다른 보드 상에서 움직일 때 전부 똑같이 작성!

if (destination?.droppableId === source.droppableId) {
  // same board movement.
  setToDos((allBoards) => {
    const boardCopy = [...allBoards[source.droppableId]];
    const taskObj = boardCopy[source.index]; //
    
    boardCopy.splice(source.index, 1);
    boardCopy.splice(destination?.index, 0, taskObj); //
    
    return {
      ...allBoards,
      [source.droppableId]: boardCopy,
    };
  });
}

if (destination.droppableId !== source.droppableId) {
  // cross board movement
  setToDos((allBoards) => {
    const sourceBoard = [...allBoards[source.droppableId]];
    const taskObj = sourceBoard[source.index]; //
    const destinationBoard = [...allBoards[destination.droppableId]];
    
    sourceBoard.splice(source.index, 1);
    destinationBoard.splice(destination?.index, 0, taskObj); //
    
    return {
      ...allBoards,
      [source.droppableId]: sourceBoard,
      [destination.droppableId]: destinationBoard,
    };
  });
}

// 그리고 이제 task를 추가해 보자!

// Board.tsx에서 
// 폼에 입력한 toDo를 빈칸으로 만들기 전에
// task로서 추가되어야 함!
// 그러니까 newToDo obj를 만들고
// id는 중복되지 않는 값인 Date.now()로 설정하고
// text는 우리가 data에서 가져올 toDo와 같은 값이 되도록 해줌.

// 걔네를 보드 안에 넣어주면 되는데,
// 일단 atoms를 import하고
// atom을 위한 setter 함수를 작성해야 함.
// useSetRecoilState를 사용해 toDoState를 import하면
// 그게 state를 조작할 수 있는 함수를 사용할 수 있도록 해 줄 것임!
// setToDos 로 설정해 주자.

const setTodos = useSetRecoilState(toDoState);

// 여기서 주의할 것!
// 우리가 boardId To Do 아니면 Done에 있다고 쳐 보자.
// 우리는 모든 이전의 board들을 그대로 놔두고
// 현재 속한 board의 정보만 업데이트 하고 싶어!
// board component는 3개 각각의 boardId에 따라 3번 render될 것이므로,
// toDo를 만들 때, 그걸 현재 내가 있는 board에만 올려줄 필요가 있음.

// 그러려면 현재 board를 사용해 copy하고 그걸 다시 state에 넣어야 함.
// 그리고 내가 toDo를 만들고 싶은 board도 그대로 놔둔 채로 하나를 더해줘야 함.
// 즉, 기존의 요소를 놔둔 채로 새로운 요소를 더해주는 것!
// 순서 설정에 따라서 위쪽에 추가될지 아래쪽에 추가될지 정할 수 있음.

const onValid = ({toDo} : IForm) => {

  const newToDo = {
    id : Date.now(),
    text : toDo,
  };

  setTodos((allBoards) => {
    return { // 이 순서!
      ...allBoards,
      [boardId] : [newToDo, ...allBoards[boardId]],
    };
  });
  setValue("toDo","");
};

///// 6.16 코드 챌린지

// input form 예쁘게 만들기
// 추가한 toDo의 모든 task state를 local storage에 저장하기 
// (안하면 새로고침 시 사라짐)

// task를 삭제할 수 있도록 
// 1. 삭제 버튼
// 2. 쓰레기통 만들어서 드롭해서 삭제
// (droppable이용, 다른 곳에 drop할 수 있도록)

// board 순서 바꿀 수 있게 하기
// board 자체를 하나의 droppabla 안에 넣어서 보드를 들어서 옮길 수 있도록!
// board state라는 atom을 만들어 모든 board의 움직임을 추적해 보자
// 위치에 따라 순서를 보여줄 수 있도록.
// 이게 너무 어렵다면, form을 하나 만들어서 board 생성이라도 해보자
// atom.tsx의 State(toDoState)를 우리가 원하는 만큼 확장할 수 있거든
// board도 똑같이 원하는 만큼 추가할 수 있으면 좋음!
// 어딘가에 input을 만들어서 엔터를 칠 때마다 board가 만들어지는 것
