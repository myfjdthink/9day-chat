import requests
import logging
import json
from datetime import datetime
from typing import List, Dict

class BaiduURLPusher:
    def __init__(self, site: str, token: str):
        """
        初始化推送器
        :param site: 站点URL
        :param token: 百度站长平台的token
        """
        self.site = site
        self.token = token
        self.api_url = f"http://data.zz.baidu.com/urls?site={site}&token={token}"
        
        # 配置日志
        self.setup_logger()

    def setup_logger(self):
        """配置日志系统"""
        logging.basicConfig(
            level=logging.INFO,
            format='%(asctime)s - %(levelname)s - %(message)s',
            handlers=[
                logging.FileHandler('baidu_push.log'),
                logging.StreamHandler()
            ]
        )
        self.logger = logging.getLogger(__name__)

    def push_urls(self, urls: List[str]) -> Dict:
        """
        推送URL列表到百度
        :param urls: URL列表
        :return: 推送结果
        """
        try:
            # 验证URLs
            valid_urls = self.validate_urls(urls)
            
            if not valid_urls:
                raise ValueError("No valid URLs to push")

            # 准备请求
            headers = {'Content-Type': 'text/plain'}
            urls_data = '\n'.join(valid_urls)

            # 发送请求
            self.logger.info(f"Pushing {len(valid_urls)} URLs to Baidu")
            response = requests.post(
                self.api_url,
                headers=headers,
                data=urls_data.encode('utf-8'),
                timeout=30
            )

            # 处理响应
            result = response.json()
            self.logger.info(f"Push result: {result}")
            
            # 保存推送记录
            self.save_push_record(valid_urls, result)
            
            return result

        except requests.exceptions.RequestException as e:
            self.logger.error(f"Network error: {str(e)}")
            return {"error": "Network error", "message": str(e)}
        except json.JSONDecodeError as e:
            self.logger.error(f"Response parsing error: {str(e)}")
            return {"error": "Response parsing error", "message": str(e)}
        except Exception as e:
            self.logger.error(f"Unexpected error: {str(e)}")
            return {"error": "Unexpected error", "message": str(e)}

    def validate_urls(self, urls: List[str]) -> List[str]:
        """
        验证URL格式
        :param urls: URL列表
        :return: 有效的URL列表
        """
        valid_urls = []
        for url in urls:
            url = url.strip()
            if url.startswith(('http://', 'https://')):
                valid_urls.append(url)
            else:
                self.logger.warning(f"Invalid URL format: {url}")
        return valid_urls

    def save_push_record(self, urls: List[str], result: Dict):
        """
        保存推送记录
        :param urls: 推送的URL列表
        :param result: 推送结果
        """
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f"push_record_{timestamp}.json"
        
        record = {
            "timestamp": timestamp,
            "urls": urls,
            "result": result
        }
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(record, f, ensure_ascii=False, indent=2)
            self.logger.info(f"Push record saved to {filename}")
        except Exception as e:
            self.logger.error(f"Failed to save push record: {str(e)}")

def main():
    # 配置信息
    SITE = "https://www.9day.tech"  # 替换为你的站点
    TOKEN = "Iokt7qn8wTcW19tW"      # 替换为你的token

    # 要推送的URL列表
    # 第一批：优先推送主页和核心功能页面
    urls_to_push = [
        # 主页（最重要）
        "https://www.9day.tech/",
        
        # 核心功能页面（用户最常访问）
        "https://www.9day.tech/analysis",     # 八字分析页面
        "https://www.9day.tech/calendar",     # 择日/日历页面
        "https://www.9day.tech/chat",         # AI对话页面
        "https://www.9day.tech/zodiac-fortune" # 生肖运势页面
    ]
    
    # 第二批（稍后推送）：
    urls_batch2 = [
        # 用户相关页面
        "https://www.9day.tech/login",        # 登录页面
        "https://www.9day.tech/register",     # 注册页面
        "https://www.9day.tech/profile"       # 个人资料页面
    ]
    
    # 第三批（最后推送）：
    urls_batch3 = [
        # 管理员页面
        "https://www.9day.tech/admin/login",      # 管理员登录
        "https://www.9day.tech/admin/panel",      # 管理面板
        "https://www.9day.tech/admin/profile"     # 管理员资料
    ]

    # 创建推送器实例
    pusher = BaiduURLPusher(SITE, TOKEN)

    # 执行推送
    result = pusher.push_urls(urls_to_push)
    
    # 打印结果
    print("Push Result:", result)

if __name__ == "__main__":
    main()

"""
https://www.9day.tech/
https://www.9day.tech/analysis
https://www.9day.tech/calendar
https://www.9day.tech/chat
https://www.9day.tech/zodiac-fortune

"""