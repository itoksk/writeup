import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.font_manager as fm
import seaborn as sns

# 日本語フォントの設定
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Hiragino Sans', 'Yu Gothic', 'Meirio', 'Takao', 'IPAexGothic', 'IPAPGothic', 'VL PGothic', 'Noto Sans CJK JP']

# スタイル設定
sns.set_style("whitegrid")

# データの読み込み
df = pd.read_csv('sales_data_monthly.csv')

# 日付型に変換
df['Month'] = pd.to_datetime(df['Month'])

# 基本的な棒グラフ
def create_bar_chart():
    plt.figure(figsize=(12, 6))
    plt.bar(df['Month'].dt.strftime('%Y-%m'), df['Sales']/1000000, color='steelblue', alpha=0.8)
    plt.title('月別売上推移', fontsize=16, fontweight='bold')
    plt.xlabel('月', fontsize=12)
    plt.ylabel('売上（百万円）', fontsize=12)
    plt.xticks(rotation=45, ha='right')
    plt.grid(axis='y', alpha=0.3)
    plt.tight_layout()
    plt.show()

# 複合グラフ（棒グラフ + 移動平均線）
def create_combined_chart():
    # 移動平均の計算
    df['Moving_Avg'] = df['Sales'].rolling(window=3, center=True).mean()
    
    fig, ax1 = plt.subplots(figsize=(14, 7))
    
    # 棒グラフ
    ax1.bar(df['Month'].dt.strftime('%Y-%m'), df['Sales']/1000000, 
            alpha=0.6, color='steelblue', label='月次売上')
    
    # 移動平均線
    ax1.plot(df['Month'].dt.strftime('%Y-%m'), df['Moving_Avg']/1000000, 
             color='red', linewidth=2, marker='o', markersize=4, label='3ヶ月移動平均')
    
    # 平均値の水平線
    avg_sales = df['Sales'].mean()
    ax1.axhline(y=avg_sales/1000000, color='green', linestyle='--', 
                linewidth=1, label=f'平均: {avg_sales/1000000:.1f}百万円')
    
    # 最大値と最小値にアノテーション
    max_idx = df['Sales'].idxmax()
    min_idx = df['Sales'].idxmin()
    
    ax1.annotate(f'最大: {df.loc[max_idx, "Sales"]/1000000:.1f}百万円',
                xy=(max_idx, df.loc[max_idx, 'Sales']/1000000),
                xytext=(max_idx-2, df.loc[max_idx, 'Sales']/1000000 + 0.5),
                arrowprops=dict(arrowstyle='->', color='red'),
                fontsize=10)
    
    ax1.annotate(f'最小: {df.loc[min_idx, "Sales"]/1000000:.1f}百万円',
                xy=(min_idx, df.loc[min_idx, 'Sales']/1000000),
                xytext=(min_idx-2, df.loc[min_idx, 'Sales']/1000000 - 0.5),
                arrowprops=dict(arrowstyle='->', color='blue'),
                fontsize=10)
    
    # ラベルとタイトル
    ax1.set_xlabel('月', fontsize=12)
    ax1.set_ylabel('売上（百万円）', fontsize=12)
    ax1.set_title('売上分析ダッシュボード - 月次推移と傾向', fontsize=16, fontweight='bold')
    ax1.legend(loc='upper left')
    ax1.grid(True, alpha=0.3)
    
    # X軸の調整
    plt.xticks(rotation=45, ha='right')
    
    plt.tight_layout()
    plt.show()

# 商品カテゴリ別の円グラフ
def create_pie_chart():
    # 商品カテゴリ別集計
    product_sales = df.groupby('Product')['Sales'].sum()
    
    plt.figure(figsize=(10, 8))
    colors = ['#FF9999', '#66B2FF', '#99FF99']
    explode = (0.05, 0.05, 0.05)  # 各要素を少し離す
    
    wedges, texts, autotexts = plt.pie(product_sales, 
                                        labels=product_sales.index,
                                        colors=colors,
                                        explode=explode,
                                        autopct='%1.1f%%',
                                        shadow=True,
                                        startangle=90)
    
    # テキストのフォントサイズ調整
    for text in texts:
        text.set_fontsize(12)
    for autotext in autotexts:
        autotext.set_color('white')
        autotext.set_fontsize(11)
        autotext.set_weight('bold')
    
    plt.title('商品カテゴリ別売上構成比', fontsize=16, fontweight='bold')
    
    # 凡例に実際の売上額を追加
    legend_labels = [f'{product}: {sales/1000000:.1f}百万円' 
                     for product, sales in product_sales.items()]
    plt.legend(legend_labels, loc='best', fontsize=10)
    
    plt.axis('equal')
    plt.tight_layout()
    plt.show()

# 前年同月比を含む高度な分析グラフ
def create_advanced_analysis():
    # データの準備
    df_2023 = df[df['Month'].dt.year == 2023].copy()
    df_2024 = df[df['Month'].dt.year == 2024].copy()
    
    # 前年同月比の計算
    df_2024['YoY_Growth'] = ((df_2024['Sales'].values - df_2023['Sales'].values) / df_2023['Sales'].values * 100)
    
    fig, (ax1, ax2) = plt.subplots(2, 1, figsize=(14, 10))
    
    # 上段：年別比較
    months = ['1月', '2月', '3月', '4月', '5月', '6月', 
              '7月', '8月', '9月', '10月', '11月', '12月']
    x = range(len(months))
    width = 0.35
    
    ax1.bar([i - width/2 for i in x], df_2023['Sales']/1000000, width, 
            label='2023年', color='lightblue', alpha=0.8)
    ax1.bar([i + width/2 for i in x], df_2024['Sales']/1000000, width, 
            label='2024年', color='darkblue', alpha=0.8)
    
    ax1.set_xlabel('月', fontsize=12)
    ax1.set_ylabel('売上（百万円）', fontsize=12)
    ax1.set_title('年別売上比較', fontsize=14, fontweight='bold')
    ax1.set_xticks(x)
    ax1.set_xticklabels(months)
    ax1.legend()
    ax1.grid(True, alpha=0.3)
    
    # 下段：前年同月比
    ax2.plot(months, df_2024['YoY_Growth'], marker='o', linewidth=2, 
             markersize=8, color='green')
    ax2.axhline(y=0, color='red', linestyle='--', linewidth=1)
    
    # 正負で色分け
    for i, (month, growth) in enumerate(zip(months, df_2024['YoY_Growth'])):
        color = 'green' if growth >= 0 else 'red'
        ax2.bar(i, growth, color=color, alpha=0.3)
        ax2.text(i, growth + 0.5 if growth >= 0 else growth - 1.5, 
                f'{growth:.1f}%', ha='center', fontsize=9)
    
    ax2.set_xlabel('月', fontsize=12)
    ax2.set_ylabel('前年同月比（%）', fontsize=12)
    ax2.set_title('前年同月比成長率', fontsize=14, fontweight='bold')
    ax2.set_xticks(range(len(months)))
    ax2.set_xticklabels(months)
    ax2.grid(True, alpha=0.3)
    
    plt.suptitle('売上分析レポート 2023-2024', fontsize=16, fontweight='bold', y=1.02)
    plt.tight_layout()
    plt.show()

if __name__ == "__main__":
    print("1. 基本的な棒グラフを作成")
    create_bar_chart()
    
    print("\n2. 複合グラフ（棒グラフ + 移動平均）を作成")
    create_combined_chart()
    
    print("\n3. 商品カテゴリ別円グラフを作成")
    create_pie_chart()
    
    print("\n4. 前年同月比を含む高度な分析グラフを作成")
    create_advanced_analysis()