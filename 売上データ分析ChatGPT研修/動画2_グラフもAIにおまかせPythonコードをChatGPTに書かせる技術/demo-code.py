#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
動画2デモ用Pythonコード例
売上データの可視化とグラフ作成
"""

import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
from datetime import datetime
import numpy as np
import seaborn as sns

# 日本語フォント設定
plt.rcParams['font.family'] = ['DejaVu Sans', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'Takao', 'IPAexGothic', 'IPAPGothic', 'VL PGothic', 'Noto Sans CJK JP']

def load_and_prepare_data(csv_file):
    """
    CSVファイルの読み込みとデータ準備
    """
    try:
        df = pd.read_csv(csv_file, encoding='utf-8')
        df['日付'] = pd.to_datetime(df['日付'])
        print(f"データ読み込み完了: {len(df)}行")
        print(f"期間: {df['日付'].min()} ~ {df['日付'].max()}")
        return df
    except Exception as e:
        print(f"データ読み込みエラー: {e}")
        return None

def create_monthly_trend_chart(df, output_file='sales_trend.png'):
    """
    月別売上推移の折れ線グラフ作成
    """
    # 月別売上の集計
    monthly_sales = df.groupby(df['日付'].dt.to_period('M'))['売上金額'].sum()
    
    # グラフの作成
    plt.figure(figsize=(12, 6))
    plt.plot(monthly_sales.index.astype(str), monthly_sales.values/10000, 
             marker='o', linewidth=2, markersize=6, color='#003366')
    
    plt.title('月別売上推移', fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('月', fontsize=12)
    plt.ylabel('売上金額（万円）', fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.xticks(rotation=45)
    
    # 値の表示
    for i, v in enumerate(monthly_sales.values):
        plt.annotate(f'{v/10000:.0f}万', 
                    (i, v/10000), 
                    textcoords="offset points", 
                    xytext=(0,10), 
                    ha='center')
    
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    plt.show()
    print(f"グラフを{output_file}に保存しました")

def create_product_ranking_chart(df, output_file='product_ranking.png'):
    """
    商品別売上ランキング棒グラフ
    """
    product_sales = df.groupby('商品名')['売上金額'].sum().sort_values(ascending=False)
    
    plt.figure(figsize=(10, 6))
    bars = plt.bar(range(len(product_sales)), product_sales.values/10000, 
                   color=['#003366', '#FF6600', '#009900'])
    
    plt.title('商品別売上ランキング', fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('商品', fontsize=12)
    plt.ylabel('売上金額（万円）', fontsize=12)
    plt.xticks(range(len(product_sales)), product_sales.index, rotation=45)
    
    # 値の表示
    for bar in bars:
        height = bar.get_height()
        plt.annotate(f'{height:.0f}万',
                    xy=(bar.get_x() + bar.get_width() / 2, height),
                    xytext=(0, 3),  # 3 points vertical offset
                    textcoords="offset points",
                    ha='center', va='bottom')
    
    plt.grid(True, alpha=0.3, axis='y')
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    plt.show()
    print(f"グラフを{output_file}に保存しました")

def create_combined_chart(df, output_file='combined_chart.png'):
    """
    売上金額と販売数量の複合グラフ
    """
    monthly_data = df.groupby(df['日付'].dt.to_period('M')).agg({
        '売上金額': 'sum',
        '数量': 'sum'
    })
    
    fig, ax1 = plt.subplots(figsize=(12, 6))
    
    # 売上金額（左軸、棒グラフ）
    color = '#003366'
    ax1.set_xlabel('月', fontsize=12)
    ax1.set_ylabel('売上金額（万円）', color=color, fontsize=12)
    bars = ax1.bar(range(len(monthly_data)), monthly_data['売上金額']/10000, 
                   color=color, alpha=0.7, label='売上金額')
    ax1.tick_params(axis='y', labelcolor=color)
    ax1.set_xticks(range(len(monthly_data)))
    ax1.set_xticklabels([str(idx) for idx in monthly_data.index], rotation=45)
    
    # 販売数量（右軸、折れ線グラフ）
    ax2 = ax1.twinx()
    color = '#FF6600'
    ax2.set_ylabel('販売数量', color=color, fontsize=12)
    line = ax2.plot(range(len(monthly_data)), monthly_data['数量'], 
                   color=color, marker='o', linewidth=2, markersize=6, label='販売数量')
    ax2.tick_params(axis='y', labelcolor=color)
    
    plt.title('売上金額と販売数量の推移', fontsize=16, fontweight='bold', pad=20)
    
    # 凡例
    lines1, labels1 = ax1.get_legend_handles_labels()
    lines2, labels2 = ax2.get_legend_handles_labels()
    ax1.legend(lines1 + lines2, labels1 + labels2, loc='upper left')
    
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    plt.show()
    print(f"グラフを{output_file}に保存しました")

def create_correlation_heatmap(df, output_file='correlation_heatmap.png'):
    """
    商品間の相関関係ヒートマップ
    """
    # 商品別月次データの準備
    pivot_data = df.pivot_table(
        values='売上金額', 
        index=df['日付'].dt.to_period('M'), 
        columns='商品名', 
        aggfunc='sum',
        fill_value=0
    )
    
    # 相関行列の計算
    correlation_matrix = pivot_data.corr()
    
    plt.figure(figsize=(8, 6))
    sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0,
                square=True, fmt='.2f', cbar_kws={"shrink": .8})
    
    plt.title('商品間売上相関関係', fontsize=16, fontweight='bold', pad=20)
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    plt.show()
    print(f"グラフを{output_file}に保存しました")

def create_dashboard(df, output_file='dashboard.png'):
    """
    包括的なダッシュボード作成
    """
    fig, ((ax1, ax2), (ax3, ax4)) = plt.subplots(2, 2, figsize=(15, 10))
    
    # 1. 月別売上推移
    monthly_sales = df.groupby(df['日付'].dt.to_period('M'))['売上金額'].sum()
    ax1.plot(range(len(monthly_sales)), monthly_sales.values/10000, 
             marker='o', color='#003366')
    ax1.set_title('月別売上推移', fontweight='bold')
    ax1.set_ylabel('売上金額（万円）')
    ax1.grid(True, alpha=0.3)
    
    # 2. 商品別売上ランキング
    product_sales = df.groupby('商品名')['売上金額'].sum().sort_values(ascending=False)
    ax2.bar(range(len(product_sales)), product_sales.values/10000, 
            color=['#003366', '#FF6600', '#009900'])
    ax2.set_title('商品別売上ランキング', fontweight='bold')
    ax2.set_ylabel('売上金額（万円）')
    ax2.set_xticks(range(len(product_sales)))
    ax2.set_xticklabels(product_sales.index, rotation=45)
    
    # 3. カテゴリ別売上構成
    category_sales = df.groupby('カテゴリ')['売上金額'].sum()
    ax3.pie(category_sales.values, labels=category_sales.index, autopct='%1.1f%%',
            colors=['#003366', '#FF6600'])
    ax3.set_title('カテゴリ別売上構成', fontweight='bold')
    
    # 4. 売上と数量の相関
    ax4.scatter(df['数量'], df['売上金額']/10000, alpha=0.6, color='#003366')
    ax4.set_title('売上金額と販売数量の相関', fontweight='bold')
    ax4.set_xlabel('販売数量')
    ax4.set_ylabel('売上金額（万円）')
    ax4.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.savefig(output_file, dpi=300, bbox_inches='tight')
    plt.show()
    print(f"ダッシュボードを{output_file}に保存しました")

def main():
    """
    メイン実行関数
    """
    # データの読み込み
    df = load_and_prepare_data('sample-data.csv')
    if df is None:
        return
    
    # 各種グラフの作成
    print("\n=== グラフ作成を開始します ===")
    
    create_monthly_trend_chart(df)
    create_product_ranking_chart(df)
    create_combined_chart(df)
    create_correlation_heatmap(df)
    create_dashboard(df)
    
    print("\n=== 全てのグラフ作成が完了しました ===")

if __name__ == "__main__":
    main()