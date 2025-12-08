#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
動画3デモ用Pythonコード例
売上予測とトレンド分析
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from sklearn.metrics import mean_absolute_error, mean_squared_error
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
import warnings
warnings.filterwarnings('ignore')

# 日本語フォント設定
plt.rcParams['font.family'] = ['DejaVu Sans', 'Hiragino Sans', 'Yu Gothic', 'Meiryo', 'Takao', 'IPAexGothic', 'IPAPGothic', 'VL PGothic', 'Noto Sans CJK JP']

def load_time_series_data(csv_file):
    """
    時系列売上データの読み込み
    """
    try:
        df = pd.read_csv(csv_file, encoding='utf-8')
        df['年月'] = pd.to_datetime(df['年月'], format='%Y-%m')
        df = df.set_index('年月').sort_index()
        print(f"データ読み込み完了: {len(df)}ヶ月分")
        print(f"期間: {df.index.min().strftime('%Y-%m')} ~ {df.index.max().strftime('%Y-%m')}")
        return df
    except Exception as e:
        print(f"データ読み込みエラー: {e}")
        return None

def analyze_trend_seasonality(df):
    """
    トレンドと季節性の分析
    """
    # 基本統計量
    print("\n=== 基本統計量 ===")
    print(f"売上平均: {df['売上金額'].mean():,.0f}円")
    print(f"売上標準偏差: {df['売上金額'].std():,.0f}円")
    print(f"売上成長率（年平均）: {((df['売上金額'].iloc[-1] / df['売上金額'].iloc[0]) ** (1/2) - 1) * 100:.1f}%")
    
    # 月別平均（季節性確認）
    df['月'] = df.index.month
    monthly_avg = df.groupby('月')['売上金額'].mean()
    
    print("\n=== 月別売上平均（季節性分析）===")
    for month, avg in monthly_avg.items():
        print(f"{month:2d}月: {avg:,.0f}円")
    
    # トレンド分析（線形回帰）
    X = np.arange(len(df)).reshape(-1, 1)
    y = df['売上金額'].values
    
    lr_model = LinearRegression()
    lr_model.fit(X, y)
    trend_slope = lr_model.coef_[0]
    
    print(f"\n=== トレンド分析 ===")
    print(f"月次成長トレンド: {trend_slope:,.0f}円/月")
    if trend_slope > 50000:
        print("判定: 強い上昇トレンド")
    elif trend_slope > 0:
        print("判定: 上昇トレンド")
    elif trend_slope > -50000:
        print("判定: 横ばいトレンド")
    else:
        print("判定: 下降トレンド")
    
    return monthly_avg, trend_slope

def create_features(df, lookback_periods=[1, 3, 6, 12]):
    """
    予測用特徴量の作成
    """
    feature_df = df.copy()
    
    # ラグ特徴量
    for period in lookback_periods:
        if len(df) > period:
            feature_df[f'売上_lag{period}'] = df['売上金額'].shift(period)
    
    # 移動平均特徴量
    for window in [3, 6, 12]:
        if len(df) >= window:
            feature_df[f'売上_ma{window}'] = df['売上金額'].rolling(window=window).mean()
    
    # 季節性特徴量
    feature_df['月'] = feature_df.index.month
    feature_df['四半期'] = feature_df.index.quarter
    feature_df['年'] = feature_df.index.year
    
    # トレンド特徴量
    feature_df['時点'] = range(len(feature_df))
    
    # 前年同月比
    if len(df) >= 12:
        feature_df['前年同月比'] = df['売上金額'] / df['売上金額'].shift(12)
    
    return feature_df

def linear_regression_forecast(df, forecast_months=6):
    """
    線形回帰による売上予測
    """
    # 特徴量作成
    X = np.arange(len(df)).reshape(-1, 1)
    y = df['売上金額'].values
    
    # モデル訓練
    model = LinearRegression()
    model.fit(X, y)
    
    # 予測
    future_X = np.arange(len(df), len(df) + forecast_months).reshape(-1, 1)
    forecast = model.predict(future_X)
    
    # 予測精度（訓練データで評価）
    train_pred = model.predict(X)
    mae = mean_absolute_error(y, train_pred)
    rmse = np.sqrt(mean_squared_error(y, train_pred))
    
    print(f"\n=== 線形回帰予測結果 ===")
    print(f"予測精度 - MAE: {mae:,.0f}円, RMSE: {rmse:,.0f}円")
    
    # 予測結果表示
    future_dates = pd.date_range(start=df.index[-1] + pd.DateOffset(months=1), 
                                periods=forecast_months, freq='MS')
    
    for i, (date, pred) in enumerate(zip(future_dates, forecast)):
        print(f"{date.strftime('%Y-%m')}: {pred:,.0f}円")
    
    return forecast, future_dates, model

def random_forest_forecast(df, forecast_months=6):
    """
    Random Forest による売上予測
    """
    # 特徴量作成
    feature_df = create_features(df)
    feature_df = feature_df.dropna()
    
    if len(feature_df) < 12:
        print("データが不足しています。Random Forest予測をスキップします。")
        return None, None, None
    
    # 特徴量選択
    feature_cols = ['売上_lag1', '売上_lag3', '売上_ma3', '売上_ma6', 
                    '月', '四半期', '時点']
    feature_cols = [col for col in feature_cols if col in feature_df.columns]
    
    X = feature_df[feature_cols].values
    y = feature_df['売上金額'].values
    
    # モデル訓練（時系列を考慮した分割）
    split_point = int(len(X) * 0.8)
    X_train, X_test = X[:split_point], X[split_point:]
    y_train, y_test = y[:split_point], y[split_point:]
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X_train, y_train)
    
    # テストデータでの予測精度
    test_pred = model.predict(X_test)
    mae = mean_absolute_error(y_test, test_pred)
    rmse = np.sqrt(mean_squared_error(y_test, test_pred))
    
    print(f"\n=== Random Forest予測結果 ===")
    print(f"テスト精度 - MAE: {mae:,.0f}円, RMSE: {rmse:,.0f}円")
    
    # 特徴量重要度
    feature_importance = pd.DataFrame({
        'feature': feature_cols,
        'importance': model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n特徴量重要度:")
    for _, row in feature_importance.iterrows():
        print(f"  {row['feature']}: {row['importance']:.3f}")
    
    # 将来予測は簡略化（最新データの特徴量を使用）
    latest_features = X[-1].reshape(1, -1)
    future_forecast = []
    
    for i in range(forecast_months):
        pred = model.predict(latest_features)[0]
        future_forecast.append(pred)
        
        # 次月の特徴量更新（簡易版）
        latest_features[0][0] = pred  # lag1を更新
        if len(latest_features[0]) > 6:  # 時点を更新
            latest_features[0][-1] += 1
    
    future_dates = pd.date_range(start=df.index[-1] + pd.DateOffset(months=1), 
                                periods=forecast_months, freq='MS')
    
    print("\n将来予測:")
    for date, pred in zip(future_dates, future_forecast):
        print(f"{date.strftime('%Y-%m')}: {pred:,.0f}円")
    
    return future_forecast, future_dates, model

def create_forecast_visualization(df, lr_forecast, rf_forecast, future_dates):
    """
    予測結果の可視化
    """
    plt.figure(figsize=(15, 8))
    
    # 実績データのプロット
    plt.plot(df.index, df['売上金額']/1000000, 'o-', color='#003366', 
             linewidth=2, markersize=6, label='実績', alpha=0.8)
    
    # 線形回帰予測
    if lr_forecast is not None:
        plt.plot(future_dates, np.array(lr_forecast)/1000000, 's--', 
                color='#FF6600', linewidth=2, markersize=6, label='線形回帰予測', alpha=0.8)
    
    # Random Forest予測
    if rf_forecast is not None:
        plt.plot(future_dates, np.array(rf_forecast)/1000000, '^--', 
                color='#009900', linewidth=2, markersize=6, label='Random Forest予測', alpha=0.8)
    
    plt.title('売上実績と予測比較', fontsize=16, fontweight='bold', pad=20)
    plt.xlabel('年月', fontsize=12)
    plt.ylabel('売上金額（百万円）', fontsize=12)
    plt.legend(fontsize=12)
    plt.grid(True, alpha=0.3)
    plt.xticks(rotation=45)
    
    # 予測期間の背景色を変更
    if len(future_dates) > 0:
        plt.axvspan(future_dates[0], future_dates[-1], alpha=0.1, color='gray', label='予測期間')
    
    plt.tight_layout()
    plt.savefig('sales_forecast.png', dpi=300, bbox_inches='tight')
    plt.show()
    print("予測グラフを sales_forecast.png に保存しました")

def generate_forecast_report(df, lr_forecast, rf_forecast, future_dates):
    """
    予測レポートの生成
    """
    print("\n" + "="*60)
    print("              売上予測レポート")
    print("="*60)
    
    # 現状分析
    latest_sales = df['売上金額'].iloc[-1]
    prev_year_sales = df['売上金額'].iloc[-12] if len(df) >= 12 else None
    
    print(f"\n【現状分析】")
    print(f"最新月売上: {latest_sales:,.0f}円")
    if prev_year_sales:
        yoy_growth = ((latest_sales / prev_year_sales) - 1) * 100
        print(f"前年同月比: {yoy_growth:+.1f}%")
    
    # 予測結果サマリー
    print(f"\n【予測結果サマリー】")
    
    if lr_forecast is not None:
        lr_total = sum(lr_forecast)
        lr_avg = np.mean(lr_forecast)
        print(f"線形回帰予測:")
        print(f"  - 6ヶ月合計: {lr_total:,.0f}円")
        print(f"  - 月平均: {lr_avg:,.0f}円")
        print(f"  - 最新月比: {(lr_forecast[0]/latest_sales-1)*100:+.1f}%")
    
    if rf_forecast is not None:
        rf_total = sum(rf_forecast)
        rf_avg = np.mean(rf_forecast)
        print(f"Random Forest予測:")
        print(f"  - 6ヶ月合計: {rf_total:,.0f}円")
        print(f"  - 月平均: {rf_avg:,.0f}円")
        print(f"  - 最新月比: {(rf_forecast[0]/latest_sales-1)*100:+.1f}%")
    
    # リスク評価
    print(f"\n【リスク評価】")
    if lr_forecast is not None and rf_forecast is not None:
        forecast_diff = abs(lr_forecast[0] - rf_forecast[0]) / latest_sales * 100
        print(f"予測モデル間の差異: {forecast_diff:.1f}%")
        
        if forecast_diff < 5:
            print("→ 低リスク：予測の確度が高い")
        elif forecast_diff < 15:
            print("→ 中リスク：注意深い監視が必要")
        else:
            print("→ 高リスク：複数シナリオでの対策が必要")
    
    print("\n【推奨アクション】")
    print("1. 月次実績の継続的監視")
    print("2. 外部要因（競合、経済環境）の情報収集")
    print("3. 予測モデルの定期的な再評価")
    print("4. 柔軟な在庫・人員計画の策定")

def main():
    """
    メイン実行関数
    """
    # データ読み込み
    df = load_time_series_data('sample-data.csv')
    if df is None:
        return
    
    # トレンド・季節性分析
    monthly_avg, trend_slope = analyze_trend_seasonality(df)
    
    # 予測実行
    lr_forecast, lr_dates, lr_model = linear_regression_forecast(df, forecast_months=6)
    rf_forecast, rf_dates, rf_model = random_forest_forecast(df, forecast_months=6)
    
    # 可視化
    future_dates = lr_dates if lr_dates is not None else rf_dates
    create_forecast_visualization(df, lr_forecast, rf_forecast, future_dates)
    
    # レポート生成
    generate_forecast_report(df, lr_forecast, rf_forecast, future_dates)

if __name__ == "__main__":
    main()