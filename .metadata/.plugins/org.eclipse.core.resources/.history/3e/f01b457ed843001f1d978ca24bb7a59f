package todo.common.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;

@Configuration //기능설정이라는 어노테이션
@PropertySource("classpath:/config.properties")
/*
 @PropertySource github에 올리지않고, 이
 */

public class DBConfig {
	@Autowired
	private ApplicationContext applicationContext;
	// 현재 만든 TodoList-backend라는 폴더 흐름
	// TodoList-backend라는 폴더 = Application = 나중에 폴더 안에 작성한 파일이 하나의 어플이나 웹에서 작동하는 파일이 되는것임
	// 추후 자바나 자바스크립트 코드로 작성한 파일을 exe와 같은 확장자로 만들어 소비자들이 다운받고 실행할 수 있는
	// 프로그램을 만들 수 있음
	
	@Bean
	@ConfigurationProperties(prefix = "spring.datasource.hikari")
	public HikariConfig hikariConfig() { //hikari = DataBase를 연결하기 위해 이용하는 기능
		return new HikariConfig(); // hikari와 같은 외부 기능을 사용하지 않으면 코드가 최소20줄
	}
	
	//연결된 DB를 스프링에서 인지하고 관리할 것을 표기
	@Bean
	public DataSource dataSource(HikariConfig config) {
		DataSource dataSource = new HikariDataSource(config);
		return dataSource;
	}
	
	//***** 마이바티스 설정 추가 *****//
	@Bean
	public SqlSessionFactory sessionFactory(DataSource dataSource) throws Exception{
		SqlSessionFactoryBean sfb = new SqlSessionFactoryBean();
		sfb.setDataSource(dataSource);
		
		// Select Insert Update Delete가 작성된 매퍼 파일이 모여있는 폴더 경로 설정
		// src/main/resources 바로 밑에 있는 mappers 폴더 안에 작성된
		// xml로 끝나는 모든 파일을 바라보겠다는 **(모두바라보기) 라는 표시 작성
		// classpath = src/main/resources		줄임말 classpath
		sfb.setMapperLocations(applicationContext.getResources("classpath:mmappers/**.xml"));
	}
	
	
}
