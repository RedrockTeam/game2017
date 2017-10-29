package org.cet.dao;

import org.apache.ibatis.annotations.Param;
import org.cet.pojo.mysql.Bind;
import org.cet.pojo.mysql.BindExample;

import java.util.List;

public interface BindMapper {
    int countByExample(BindExample example);

    int deleteByExample(BindExample example);

    int deleteByPrimaryKey(Integer id);

    int insert(Bind record);

    int insertSelective(Bind record);

    List<Bind> selectByExample(BindExample example);

    Bind selectByPrimaryKey(Integer id);

    int updateByExampleSelective(@Param("record") Bind record, @Param("example") BindExample example);

    int updateByExample(@Param("record") Bind record, @Param("example") BindExample example);

    int updateByPrimaryKeySelective(Bind record);

    int updateByPrimaryKey(Bind record);
}