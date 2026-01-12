<div align="center">
<img width="150" height="150" src="./pic/BookSourcePixiv.png" alt="Pixiv BookSource"/>
<br>

# 备份与恢复
### 🅿️ [开源阅读](https://github.com/gedoor/legado) Pixiv 书源
#### ✈️ 频道 [@PixivSource](https://t.me/PixivSource)
#### ☕ [书源项目打赏名单](./Sponsor.md)
</div>


## 备份与恢复 {#WebdavBackup}
> [!IMPORTANT] 重要
>
> **【开源阅读】没有账号体系，不能在登录书源网站的同时恢复数据**
>
> **需要配置 Webdav 服务，才能从云端恢复数据**

> [!NOTE] 提示
> 
> 所有 **支持 WebDav 的云盘** 都可以备份数据。**建议使用【坚果云】**
> 
> 坚果云每月有 1G 免费流量，备份阅读数据已经足够了。


## 配置坚果云
### 🌰 注册坚果云

### ☁️ [登录坚果云](https://www.jianguoyun.com/d/signup)

### 🛠 [配置坚果云](https://www.yuque.com/legado/wiki/fkx510)

#### 1. 在右上角点击【用户名】，选择【账户信息】

![image.png](https://cdn.nlark.com/yuque/0/2021/png/12737724/1614782003487-6ec8950c-6d47-462b-b350-8f7d490d8cd1.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_55%2Ctext_TGVnYWRvIMK3IOW8gOa6kOmYheivuw%3D%3D%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

#### 2. 点击【安全选项】后，在第三方管理里【添加应用】
![image.png](https://cdn.nlark.com/yuque/0/2021/png/12737724/1614782472368-aa50fe7e-ae13-4fd2-ac9e-3a0957b0bd29.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_55%2Ctext_TGVnYWRvIMK3IOW8gOa6kOmYheivuw%3D%3D%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

#### 3. 输入名称，点击【生成密码】，最后点击完成
![image.png](https://cdn.nlark.com/yuque/0/2021/png/12737724/1614782954299-0dd59ade-5bc4-4dc6-9abd-3b696237ebc8.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_16%2Ctext_TGVnYWRvIMK3IOW8gOa6kOmYheivuw%3D%3D%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)

#### 4. 到此 WebDav 账户设置完成
![image.png](https://cdn.nlark.com/yuque/0/2021/png/12737724/1614783363300-d74cf960-ddf4-4a04-aee2-df1f21565b0f.png?x-oss-process=image%2Fwatermark%2Ctype_d3F5LW1pY3JvaGVp%2Csize_23%2Ctext_TGVnYWRvIMK3IOW8gOa6kOmYheivuw%3D%3D%2Ccolor_FFFFFF%2Cshadow_50%2Ct_80%2Cg_se%2Cx_10%2Cy_10)


## 设置备份信息
### ⚙️ 设置备份信息
#### 1. 进入备份与恢复
**主界面 - 我的 - 设置 - 备份与恢复**

![img](./pic/WebdavBackup0.png)


#### 2. 设置 WebDav 备份信息
![img](./pic/WebdavBackup1.png)

在 WebDav 设置里，填入服务器地址、账户、应用密码，保存。
> [!IMPORTANT] 重要
>  
> **请填入【自己的】 Webdav 服务器地址、账户、应用密码，**
> 
> **不然会导致个人数据泄露**


### 📂 设置备份目录
**点击备份路径，设置备份目录**

![img.png](./pic/WebdavBackup2.png)

**点击备份，此时则会弹出下面的弹窗**

![img](./pic/SaveFileSettings0.png)

**点击确定，这里可以任选其中一个**

![img](./pic/SaveFileSettings1.png)

**来到你想保存书籍的文件夹时，点击确认**

![img](./pic/SaveFileSettings2.png)


### 💾 自动备份
> [!TIP] 建议
> 
> **完成 WebDav 备份设置后，每次退出 APP 即会自动备份**
> 
> **仅返回式退出会自动备份，任务栏直接关闭不会备份**
> 
> **同一天的备份会覆盖，不同日期的备份不会覆盖**


## 备份与恢复
![img.png](./pic/WebdavBackup2.png)

### ⬆️ 备份数据
**备份与恢复，点击【备份】即可备份数据**
> [!TIP] 建议
> 首次备份，请检查坚果云里是否有备份文件。 
> 
> 如果备份失败，请手动在坚果云根目录新建文件夹"legado"，然后再备份

 
### ⬇️ 恢复数据
**备份与恢复，点击【恢复】即可恢复数据**

![img](./pic/WebdavBackup3.png)

**选择需要恢复的备份文件，即可恢复数据**
