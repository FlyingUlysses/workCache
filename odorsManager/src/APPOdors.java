package com.yawa.model;

import java.util.Date;
import java.util.HashMap;
import java.util.List;

import org.apache.commons.lang.StringUtils;

import net.sf.json.JSONObject;

import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.upload.UploadFile;
import com.yawa.common.ConstantItems;
import com.yawa.common.DataPkg;
import com.yawa.core.model.Company;
import com.yawa.core.model.User;
import com.yawa.tank.model.Odor;
import com.yawa.util.model.Attach;
import com.yawa.util.model.Page;

/**
 *@Title:加臭器管理模块
 *@Description:
 *@Author:WangYong
 *@Since:2017-7-25
 *@Version:1.1.0
 */
public class APPOdors {
    
    public static final APPOdors me = new APPOdors();
    
    /**
     * 获取加臭器分页列表展示
     * @param datapkg
     * @return
     * @Description:
     * type状态，own为个人，无为所有
     */
    public DataPkg getPageOdors(DataPkg datapkg) {
        DataPkg rtDataPkg = new DataPkg();
        rtDataPkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        JSONObject jsonObj = datapkg.getInParam();
        Integer page = 1;
        Integer limit = 20;
        String filter ="";
        String  type =null;
        User user = User.me.findById(datapkg.getOperID());
        Company company = Company.me.findById(user.getInt("company"));
        boolean flag = Company.me.isSystem(company);
        try{ page =  jsonObj.getInt("page"); }catch(Exception e){}
        try{ type =  jsonObj.getString("type"); }catch(Exception e){}
        if (!flag) {
            filter += " and so.company = "+user.getInt("company");
        }
        if (type !=null && StringUtils.isNotBlank(type) ) {
            filter+=" and so.creator = "+user.getInt("id");
        }
        String sql= "select so.id,(select name from sites where state =1 and id = so.site_id) site_name, "
                  + " (select name from dict where state =1 and type ='I' and GROUP_CODE ='ODORS_METHOD' and code = so.method) method_name, "
                  + " so.fill,so.surplus,so.dosage,DATE_FORMAT(so.create_time,'%Y-%m-%d %H:%i') create_time, "
                  + " (select name from base_users where state =1 and id =so.creator) creator_name "
                  + " from site_odors so where so.state =1 "+filter+" order by so.create_time desc limit ?,?  ";
        Long size = Db.queryLong("select count(1) from site_odors so where state =1 "+filter);
        List<Record> odorsList = Db.find(sql,(page-1)*limit,limit);
        Page<Record> pages = new Page<Record>(page, limit, size, odorsList);
        rtDataPkg.setOutParam(pages);
        return rtDataPkg;
    }
    
    
    /**
     * 获取单个加臭器巡检详情
     * @param datapkg
     * @return
     * @throws Exception 
     * @Description:
     */
    public DataPkg getOdor(DataPkg datapkg) throws Exception {
         DataPkg rtDataPkg = new DataPkg();
        rtDataPkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        JSONObject jsonObj = datapkg.getInParam();
        Integer id =null;
        try{ id =  jsonObj.getInt("id"); }catch(Exception e){}
        if (id==null) {
            throw new Exception(" 获取加臭器信息失败！ ");
        }
        String sql="select so.id,(select name from sites where state =1 and id = so.site_id) site_name,so.site_id, "
                  +" (select name from dict where state =1 and type ='I' and GROUP_CODE ='ODORS_METHOD' and code = so.method) method_name,so.method," 
                  +" so.device_id,(SELECT  b.name FROM site_device a, devices b WHERE a.deviceId = b.id and b.abbr = 'odor' and a.id = so.device_id ) device_name,"
                  +" so.fill,so.surplus,so.dosage,so.remarks,so.creator "
                  +" from site_odors so where so.state =1 and so.id =? ";
        List<Record> images = Db.find("select concat((select value from app_base where code = 'access_path'),'/',a.attach_type,'/',so.id,'/',a.store_name) image ,a.id  from attaches a  join site_odors so on a.attach_id=so.id " 
                            + " where a.state =1 and a.attach_type=? and so.id =?  ",com.yawa.util.model.ConstantItems.APP_ODOR,id);
        HashMap<String, Object> hm = new HashMap<String, Object>();
        Record odor = Db.findFirst(sql,id);
        Boolean flag=datapkg.getOperID() == odor.getInt("creator");
        hm.put("flag", flag);
        hm.put("images", images);
        hm.put("odor", odor);
        rtDataPkg.setOutParam(hm);
        return rtDataPkg;
    }

    
    /**
     * 根据站点选择加臭器
     * @param datapkg
     * @return
     * @throws Exception 
     * @Description:
     */
    public DataPkg getOdorDevice(DataPkg datapkg) throws Exception {
        DataPkg rtDataPkg = new DataPkg();
        rtDataPkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        JSONObject jsonObj = datapkg.getInParam();
        Integer siteId = null;
        Integer page = 1;
        Integer limit = 100;
        String searchTxt = "";
        try{ siteId =  jsonObj.getInt("site_id"); }catch(Exception e){}
        try{ searchTxt =  jsonObj.getString("searchTxt"); }catch(Exception e){}
        try{  page =  jsonObj.getInt(" page"); }catch(Exception e){}
        String filter ="";
        if (siteId==null) {
            throw new Exception(" 获取设备信息失败！ ");
        }else{
            filter+=" and a.site_id= "+siteId;
        }
        if (StringUtils.isNotBlank(searchTxt)) {
            filter+=" and b.name like '%"+searchTxt+"%' ";
        }
        String sql= "select a.id, b.name from site_device a, devices b where a.state=1 and a.deviceid = b.id and b.abbr = 'odor' "+filter+" order by a.id limit ?,?";
        List<Record> deviceList = Db.find(sql,(page-1)*limit,limit);
        rtDataPkg.setOutParam(deviceList);
        return rtDataPkg;
    }

    /**
     * 保存加臭器巡检详情
     * @param datapkg
     * @return
     * @throws Exception 
     * @Description:
     */
    @SuppressWarnings("unchecked")
    public DataPkg saveOdor(DataPkg datapkg) throws Exception {
        DataPkg rtDataPkg = new DataPkg();
        rtDataPkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtDataPkg.setRetmsg("设备保存成功！");
        JSONObject dataObj = datapkg.getInParam();
        List<UploadFile> files = datapkg.getUploadFiles();
        Integer id =null;
        User user = User.me.findById(datapkg.getOperID());
        Company company = Company.me.findById(user.getInt("company"));
        try{ id = dataObj.getInt("id");}catch(Exception e){}
        try {
            Odor odor = new Odor();
            if (id==null) {
                if (files==null || files.size()==0) {
                    throw new Exception("请添加巡检图片！");
                }
                dataObj.remove("id");
                odor.setAttrs(dataObj)
                    .set("create_time", new Date())
                    .set("creator",user.getInt("id"))
                    .set("company", company.getInt("id"))
                    .set("state", 1).save();
            }else{
                odor =Odor.me.findById(dataObj.getInt("id"));
                odor.setAttrs(dataObj)
                    .set("update_time", new Date())
                    .update();
            }
        //保存图片
        if ( files !=null && files.size()!=0) {
            Attach.me.saveFile(com.yawa.util.model.ConstantItems.APP_ODOR,odor.getInt("id"), files);
        }
        } catch (Exception e) {
            rtDataPkg.setRetcode(ConstantItems.CODE_COMMON_BUSFAILED);
            rtDataPkg.setRetmsg("设备保存失败:" + e.getMessage());
        }
        return rtDataPkg;
    }

    /**
     * 删除加臭器巡检
     * @param datapkg
     * @return
     * @throws Exception 
     * @Description:
     */
    public DataPkg rmvOdor(DataPkg datapkg) throws Exception {
        DataPkg rtDataPkg = new DataPkg();
        rtDataPkg.setRetcode(ConstantItems.CODE_COMMON_SUCCESS);
        rtDataPkg.setRetmsg("删除成功！");
        JSONObject dataObj = datapkg.getInParam();
        Integer id =null;
        try{id=dataObj.getInt("id");}catch (Exception e){}
        if (id ==null) {
            throw new Exception("获取加臭器信息失败！");
        }
        try {
            Odor odor = Odor.me.findById(id);
            odor.set("state", 0)
                .update();
        } catch (Exception e) {
            rtDataPkg.setRetcode(ConstantItems.CODE_COMMON_BUSFAILED);
            rtDataPkg.setRetmsg("设备删除失败:" + e.getMessage());
        }
        return rtDataPkg;
    }
    
    
    
    
    
}
