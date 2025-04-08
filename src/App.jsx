import { useRef, useState } from "react";
import "./App.css";

function App() {
  const dragItem = useRef();
  const dragOverItem = useRef();
  const [todoList, setTodoList] = useState([
    { id: 0, content: "123" },
    { id: 1, content: "코딩 공부하기" },
    { id: 2, content: "잠 자기" },
  ]);

  // 드래그 앤 드랍 기능
  // 드래그 시작
  const dragStart = (e, position) => {
    dragItem.current = position;
  };

  //드래그 오버
  const dragEnter = (e, position) => {
    dragOverItem.current = position;
  };

  //드래그 드랍시
  const drop = () => {
    const newList = [...todoList];
    const dragItemValue = newList[dragItem.current];
    newList.splice(dragItem.current, 1);
    newList.splice(dragOverItem.current, 0, dragItemValue);
    dragItem.current = null;
    dragOverItem.current = null;
    setTodoList(newList);
  };

  return (
    <>
      <TodoInput todoList={todoList} setTodoList={setTodoList} />
      <hr />
      <TodoList
        todoList={todoList}
        setTodoList={setTodoList}
        dragStart={dragStart} // drag&drop props 전달
        dragEnter={dragEnter} // drag&drop props 전달
        drop={drop} // drag&drop props 전달
      />
    </>
  );
}

// 추가하기 부분

function TodoInput({ todoList, setTodoList }) {
  const [inputValue, setInputValue] = useState("");

  return (
    <div className="todoContainer flex">
      <input
        className="todoInput" // 글씨를 쓰면 INPUTvalue 의 값을 바꾼다
        value={inputValue}
        onChange={(event) => setInputValue(event.target.value)}
      />
      <button
        className="todoButton" // button을 누르면 id에 ms 단위로 생성 todo List에 input value 값 추가
        onClick={() => {
          const newTodo = { id: Number(new Date()), content: inputValue };
          const newTodoList = [...todoList, newTodo];
          setTodoList(newTodoList);
          setInputValue("");
        }}
      >
        추가하기
      </button>
    </div>
  );
}

// Todo 컴포넌트에 List 뿌리기
function TodoList({ todoList, setTodoList, dragStart, dragEnter, drop }) {
  return (
    <ul className="todoList flex">
      {todoList.map((todo, idx) => (
        <Todo
          key={todo.id}
          todo={todo}
          setTodoList={setTodoList}
          dragStart={dragStart} // drag&drop props 전달
          dragEnter={dragEnter} // drag&drop props 전달
          drop={drop} // drag&drop props 전달
          idx={idx} // drag&drop props 전달
        />
      ))}
    </ul>
  );
}

//  todo 항목 보여주기 input 수정버튼 삭제버튼 구현
function Todo({ todo, setTodoList, dragStart, dragEnter, drop, idx }) {
  const [inputValue, setInputValue] = useState("");
  const [inputShow, setInputShow] = useState(false);
  const [ischecked, setischecked] = useState(false);

  const handleChecked = (e) => {
    setischecked(!ischecked);
  };
  return (
    // todo 항목 보여주기
    <li
      className={`flex todo ${ischecked && "done"}`}
      draggable
      onDragStart={(e) => dragStart(e, idx)} // drag&drop props 이벤트 App 컴포넌트에서 실행
      onDragEnter={(e) => dragEnter(e, idx)} // drag&drop props 이벤트 App 컴포넌트에서 실행
      onDragEnd={drop} // drag&drop props 이벤트 App 컴포넌트에서 실행
      onDragOver={(e) => e.preventDefault()} // drag&drop props 이벤트 App 컴포넌트에서 실행
    >
      {!inputShow && <span className="todoContent">{todo.content}</span>}
      {inputShow && (
        <input
          className="todoInputCorrect" // input 버튼 클릭시 value 갑 변경
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
        />
      )}
      <button
        className="todoButton"
        onClick={() => {
          setInputShow(!inputShow);
          setInputValue(todo.content);
          setTodoList((prev) =>
            prev.map((el) =>
              el.id === todo.id ? { ...el, content: inputValue } : el
            )
          );
        }}
      >
        수정
      </button>
      <button
        className="todoButton"
        onClick={() => {
          setTodoList((prev) => {
            return prev.filter((el) => el.id !== todo.id);
          });
        }}
      >
        삭제
      </button>
      <label>
        <input
          className="todoCheck"
          type="checkbox"
          checked={ischecked}
          onChange={handleChecked}
        />{" "}
        완료
      </label>{" "}
    </li>
  );
}

export default App;
