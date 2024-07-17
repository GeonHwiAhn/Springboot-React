package todo.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import todo.dto.Todo;
import todo.dto.TodoMember;
import todo.mapper.TodoMapper;

@Service
public class TodoServiceImpl implements TodoService {
	
	@Autowired
	private TodoMapper mapper;
	
	@Override
	public int idCheck(String id) {
		return mapper.idCheck(id);
	}
	
	@Override
	public int signup(TodoMember member) {
		return mapper.signup(member);
	}
	
	@Override
	public Map<String, Object> login(TodoMember member) {
		TodoMember loginMember = mapper.login(member);
		
		Map<String, Object> map = new HashMap<String, Object>();
		map.put("loginMember", loginMember);
		
		//만약에 로그인한 멤버 정보가 조회되면 그 멤버가 작성한 투두리스트를 보여주겠다.
		if(loginMember != null) {
			List<Todo> todoList = mapper.selectTodoList(loginMember.getTodoMemberNo());
			// map 형태로 프론트엔드 전달 todoList라는 이름(key)으로 todoList 내용(value) 전달
			map.put("todoList", todoList);
		}
		return map;
	}
		
		@Override
		public int insert(Todo todo) {
			int result = mapper.insert(todo);
			//삼항연산자 조회된 결과가 result > 0 0보다 큰 것이
			//		  ? 참인 경우 todo.getTodoNo() 할일 번호 가져와서 넣어줄 것
			//		  : 거짓인경우 0 전달
			return result > 0 ? todo.getTodoNo() : 0;
		}
	
		@Override
		public int update(Todo todo) {
			return mapper.update(todo);
		}
		
		@Override
		public int delete(int todoNo) {
			return mapper.delete(todoNo);
		}
		
		//react -> map key value 형태로 키이름과 키에 해당하는 값이 들어올 것
	
}
