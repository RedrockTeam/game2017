package org.game.component;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import redis.clients.jedis.Jedis;
import redis.clients.jedis.JedisPool;
import java.util.List;
import java.util.Set;

/**
 * redis客户端单机版实现类
 * @author win8.1
 *
 */
@Component
public class JedisClient {

	@Autowired
	private JedisPool jedisPool;
	private static final JedisClient js = new JedisClient();

	public static JedisClient getInstance(){
		return js;
	}



	public String set(String key, String value) {
		Jedis jedis = jedisPool.getResource();
		String result = jedis.set(key, value);
		jedis.close();
		return result;
	}


	public String get(String key) {
		Jedis jedis = jedisPool.getResource();
		String result = jedis.get(key);
		jedis.close();
		return result;
	}


	public Long hset(String key, String filed, String value) {
		Jedis jedis = jedisPool.getResource();
		Long result = jedis.hset(key, filed,value);
		jedis.close();
		return result;
	}


	public String hget(String key, String filed) {
		Jedis jedis = jedisPool.getResource();
		String result = jedis.hget(key,filed);
		jedis.close();
		return result;
	}


	public Long incr(String key) {
		Jedis jedis = jedisPool.getResource();
		Long result = jedis.incr(key);
		jedis.close();
		return result;
	}


	public Long decr(String key) {
		Jedis jedis = jedisPool.getResource();
		Long result = jedis.decr(key);
		jedis.close();
		return result;
	}

	/**获取所有符合匹配的键
	 *
	 * @param pattern
	 * @return
	 */
	public Set<String> keys(final String pattern) {
		Jedis jedis = jedisPool.getResource();
		Set<String> result = jedis.keys(pattern);
		jedis.close();
		return result;
	}


	public Long expire(String key, int second) {
		Jedis jedis = jedisPool.getResource();
		Long result = jedis.expire(key,second);
		jedis.close();
		return result;
	}


	public Long ttl(String key) {
		Jedis jedis = jedisPool.getResource();
		Long result = jedis.ttl(key);
		jedis.close();
		return result;
	}


	public Long hdel(String key, String filed) {
		Jedis jedis = jedisPool.getResource();
		Long result = jedis.hdel(key,filed);
		jedis.close();
		return result;
	}
	public Long del(String key) {
		Jedis jedis = jedisPool.getResource();
		Long result = jedis.del(key);
		jedis.close();
		return result;
	}

	public Long sadd(final String key, final String... members) {
		Jedis jedis = jedisPool.getResource();
		Long result = jedis.sadd(key,members);
		jedis.close();
		return result;
	}

	public Boolean sismember(final String key, final String member) {
		Jedis jedis = jedisPool.getResource();
		Boolean result = jedis.sismember(key,member);
		jedis.close();
		return result;
	}

	public Set<String> smembers(final String key) {
		Jedis jedis = jedisPool.getResource();
		Set<String> result = jedis.smembers(key);
		jedis.close();
		return result;
	}

	public String srandmember(final String key) {
		Jedis jedis = jedisPool.getResource();
		String result = jedis.srandmember(key);
		jedis.close();
		return result;
	}
	public List<String> srandmember(final String key, final int count){
		Jedis jedis = jedisPool.getResource();
		List<String> result = jedis.srandmember(key,count);
		jedis.close();
		return result;
	}
	public String spop(final String key){
		Jedis jedis = jedisPool.getResource();
		String result = jedis.spop(key);
		jedis.close();
		return result;
	}
	public long scard(final String key) {
		Jedis jedis = jedisPool.getResource();
		long result = jedis.scard(key);
		jedis.close();
		return result;
	}

}
