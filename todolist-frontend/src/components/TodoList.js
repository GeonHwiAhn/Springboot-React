import React, {useState, useContext} from "react";
import TodoListContext from "./TodoListContext";

const TodoList = () => {

    const {todoList, setTodoList, loginMember} = useContext(TodoListContext);

    const [inputTodo, setInputTodo] = useState('');

    let keyIndex = 0;

    // 할 일 추가버튼 기능 설정
     const 할일추가버튼 = () => {

        //만약에 할 일이 입력되지 않았다면 입력해달라는 알람창 띄워주기
        if (inputTodo.trim().length === 0) { //trim() = 앞 뒤 공백 제거 스페이스바 거부
            alert('할 일을 입력해주세요.');
            return;
        }

        fetch("/todo", { //TodoController에서 /todo 라는 URL 주소에서 DB에 값 추가하기
            method: "post",
            headers: {'Content-Type' : 'application/json'},
            body : JSON.stringify({
                title:inputTodo,
                todoMemberNo:loginMember.todoMemberNo
            })
        })
        .then(response => response.text())
        .then(todoNo => {

            if(Number(todoNo) === 0) { // 실패시 멈춤
                return;
            }
            /*
                기존 todoList + 새로 추가된 Todo를 이용해 새 배열을 만들어 todoList 대입
            */
           //새로 추가된 Todo 만들기
           const newTodo = {
            todoNo:todoNo,
            title:inputTodo,
            isDone:'O',
            todoMemberNo:loginMember.todoMemberNo
           };

           // 기존 todoList + newTodo 를 이용해서 새로운 할 일 목록을 만들기
           // 기존에 있던 할 일 목록과 새로 등록할 할 일 목록 합치기
           const newTodoList = [...todoList, newTodo];

           // todoList에 대입
           setTodoList(newTodoList);
           setInputTodo(''); //기존에 작성된 input값 비워주기
        })
        //문제가 생기면 문제 console창에서 보여주기
        .catch(
            e =>console.log(e)
        );
     }

     // O,X 업데이트 할 일을 완료하면 X버튼이 표시, 할 일을 완료하지 못하면 O버튼이 표시
     //             할 일을 처음부터 끝까지 모두 완료 미완료 처리하는 것이 아니라
     //             특정 할 일과 그 할 일의 번호를 받아 특정 할 일만 수정
     const 할일수정버튼 = (todo, index) => {
        console.log("todo가 뭐지 ? ", todo);
        console.log("index가 뭘까요 ?", index);

        fetch("/todo", {
            method: "put", //controller putMapping 작성한다했기에 put
            // headers에서 
            // Content-Type는 소비자가 Controller로 값을 전달할 때 
            // 이 값이 이미지, 동영상, 글자 등 어떤 파일인지 전달하는 공간
            headers:{'Content-Type' : 'application/json'},
            // JSON으로 된 파일을 글자로 변경해서 글자 취급으로 사용
            body: JSON.stringify({
                todoNo: todo.todoNo,
                isDone : todo.isDone === 'O' ? 'X' : 'O' 
                /* 
                만약에  
                삼항연산자   조건이    ? true일 때 실행할 구문 : 조건이 false일 때 실행할 구문 
                            todo.isDone === 'O'  ? 'X' 
                할일 완료 여부에 O로 표시되어 있으면  X로 글자 변경
                            todo.isDone === 'O'  :  todo.isDone이 X라면 이라는 표기
                            todo.isDone === 'O'  : 'O' 
                할일 완료 여부에 로 표시되어 있으면   O로 글자 변경
                */
            })
        })
        .then(response => response.text())
        .then(result => {
            // 응답에 대한 결과가 없다면 업데이트 실패했습니다. 띄워주기
            if(result === '0') {
                alert("할 일 수정에 실패했습니다.");
                return;
            }
            // 수정 성공 시 todoList 값을 변경해서 새로고침

            // 기존할일목록(todoList) 복사해서 새로 추가된 할일 을 더한다음
            // 새로운 할 일로 업데이트
            const newTodoList = [...todoList];

            // index번호의 태그 값을 O나 X로 변경
            newTodoList[index].isDone = newTodoList[index].isDone ==='O'?'X':"O";

            setTodoList(newTodoList);
        })
        .catch(e => console.log(e));

     }
     /*삭제하고 싶은 번호를 가지고 삭제 */
     const 할일삭제버튼 = (todoNo, index) => {
        fetch("/todo", {
            method:'delete',
            headers: {'Content-Type' : 'application/JSON'},
            body:todoNo
        })
        .then(response => response.text()) //응답결과를 글자형식으로 가져오겠다.
        .then(result => {
            //만약에 결과가 0이라면 alert창으로 삭제에 실패하였습니다. 띄워주고 되돌리기
            if(result === '0') {
                alert('삭제에 실패하였습니다.')
                return;
            }

            const newTodoList = [...todoList]; //배열 복사
            
            //배열.splice(인덱스, 몇칸)
            // -> 배열의 인덱스 몇 번째 태그부터 몇 칸을 잘라내서 반환할지 지정
            // 배열에서 잘라진 부분이 사라짐
            newTodoList.splice(index, 1); //내가 선택한 번호 하나만 삭제
            /*
                 newTodoList.           splice                     (index               , 1);
            새로운목록리스트.괄호안에 작성한부분 제외하고 목록새로작성(내가선택한번호, 하나만삭제);
            */
           setTodoList(newTodoList); //새로 작성한 목록으로 기존목록에 대체하기
        })
        //삭제 안될 때 문제 보여주기 왜 문제가 생겼는지 개발자용 콘솔창에서만 보여주는 것
        .catch(e => console.log(e));
     }

    return (
        <>
            <h1>{loginMember.name}의 Todo List</h1>
            <div className="todo-container">
                <h3>할 일(Todo) 입력</h3>
                <div>
                    <input 
                    type="text" 
                    value={inputTodo} 
                    onChange={ e => setInputTodo(e.target.value)} />
                    <button onClick={할일추가버튼}>할 일  추가하기</button>
                </div>

                <ul>
                    {/*배열.map : 기존 배열을 이용해서 새로운 배열 만들기 */}
                    {todoList.map((todo, index) => (
                        <li key={keyIndex++}>
                            <div>
                                <span className={ todo.isDone === 'X' ? 'todo-compleate' : ''}>
                                    {todo.title}
                                </span>

                                <span>
                                    <button onClick={() => {할일수정버튼(todo, index)}}>
                                        {todo.isDone}
                                    </button>
                                    <button onClick={() => {할일삭제버튼(todo.todoNo, index)}}>
                                        삭제
                                    </button>
                                </span>
                            </div>

                        </li>
                    ))}

                </ul>
            </div>
        </>
    )
}
export default TodoList;