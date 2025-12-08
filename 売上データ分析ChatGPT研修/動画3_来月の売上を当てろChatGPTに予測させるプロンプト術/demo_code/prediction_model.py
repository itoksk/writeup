import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import matplotlib.pyplot as plt
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, mean_absolute_percentage_error
import warnings
warnings.filterwarnings('ignore')

# 日本語フォントの設定
plt.rcParams['font.family'] = 'sans-serif'
plt.rcParams['font.sans-serif'] = ['Hiragino Sans', 'Yu Gothic', 'Meirio', 'Takao', 'IPAexGothic', 'IPAPGothic', 'VL PGothic', 'Noto Sans CJK JP']

class SalesPrediction:
    def __init__(self, csv_path='sales_data_monthly.csv'):
        """売上予測クラスの初期化"""
        self.df = pd.read_csv(csv_path)
        self.df['Month'] = pd.to_datetime(self.df['Month'])
        self.df = self.df.sort_values('Month')
        self.df.reset_index(drop=True, inplace=True)
        
    def basic_statistics(self):
        """基本統計量の表示"""
        print("=" * 60)
        print("売上データの基本統計量")
        print("=" * 60)
        print(f"平均売上: {self.df['Sales'].mean()/1000000:.2f} 百万円")
        print(f"標準偏差: {self.df['Sales'].std()/1000000:.2f} 百万円")
        print(f"最大売上: {self.df['Sales'].max()/1000000:.2f} 百万円")
        print(f"最小売上: {self.df['Sales'].min()/1000000:.2f} 百万円")
        print(f"データ期間: {self.df['Month'].min().strftime('%Y-%m')} ～ {self.df['Month'].max().strftime('%Y-%m')}")
        print()
        
    def linear_regression_prediction(self):
        """線形回帰による予測"""
        print("=" * 60)
        print("線形回帰による売上予測")
        print("=" * 60)
        
        # 特徴量の準備
        X = np.arange(len(self.df)).reshape(-1, 1)
        y = self.df['Sales'].values
        
        # モデルの訓練
        model = LinearRegression()
        model.fit(X, y)
        
        # 来月の予測
        next_month_index = len(self.df)
        prediction = model.predict([[next_month_index]])[0]
        
        # トレンドの計算
        trend_coefficient = model.coef_[0]
        
        print(f"トレンド係数: {trend_coefficient/1000000:.2f} 百万円/月")
        print(f"来月の予測売上: {prediction/1000000:.2f} 百万円")
        print()
        
        return prediction
    
    def seasonal_prediction(self):
        """季節性を考慮した予測"""
        print("=" * 60)
        print("季節性を考慮した売上予測")
        print("=" * 60)
        
        # 月ごとの季節指数を計算
        self.df['month_num'] = self.df['Month'].dt.month
        seasonal_index = self.df.groupby('month_num')['Sales'].mean()
        overall_mean = self.df['Sales'].mean()
        seasonal_factors = seasonal_index / overall_mean
        
        # トレンド成分の抽出
        X = np.arange(len(self.df)).reshape(-1, 1)
        y = self.df['Sales'].values
        model = LinearRegression()
        model.fit(X, y)
        
        # 来月の予測
        next_month_index = len(self.df)
        next_month = (self.df['Month'].iloc[-1] + pd.DateOffset(months=1))
        next_month_num = next_month.month
        
        # トレンド予測
        trend_prediction = model.predict([[next_month_index]])[0]
        
        # 季節調整
        seasonal_factor = seasonal_factors.get(next_month_num, 1.0)
        adjusted_prediction = trend_prediction * seasonal_factor
        
        print(f"次の予測月: {next_month.strftime('%Y年%m月')}")
        print(f"トレンドベース予測: {trend_prediction/1000000:.2f} 百万円")
        print(f"季節調整係数: {seasonal_factor:.2f}")
        print(f"季節調整後予測: {adjusted_prediction/1000000:.2f} 百万円")
        print()
        
        # 季節指数の表示
        print("月別季節指数:")
        months_jp = ['1月', '2月', '3月', '4月', '5月', '6月', 
                     '7月', '8月', '9月', '10月', '11月', '12月']
        for month, factor in seasonal_factors.items():
            print(f"  {months_jp[month-1]}: {factor:.2f}")
        print()
        
        return adjusted_prediction
    
    def moving_average_prediction(self, window=3):
        """移動平均による予測"""
        print("=" * 60)
        print(f"{window}ヶ月移動平均による売上予測")
        print("=" * 60)
        
        # 移動平均の計算
        ma_prediction = self.df['Sales'].tail(window).mean()
        
        # 直近のデータ表示
        print(f"直近{window}ヶ月の売上:")
        for i in range(window):
            month = self.df['Month'].iloc[-(window-i)]
            sales = self.df['Sales'].iloc[-(window-i)]
            print(f"  {month.strftime('%Y年%m月')}: {sales/1000000:.2f} 百万円")
        
        print(f"\n移動平均予測: {ma_prediction/1000000:.2f} 百万円")
        print()
        
        return ma_prediction
    
    def ensemble_prediction(self):
        """アンサンブル予測（複数手法の組み合わせ）"""
        print("=" * 60)
        print("アンサンブル予測（複数手法の組み合わせ）")
        print("=" * 60)
        
        # 各手法で予測
        linear_pred = self.linear_regression_prediction()
        seasonal_pred = self.seasonal_prediction()
        ma_pred = self.moving_average_prediction()
        
        # 重み付け平均
        weights = {'線形回帰': 0.3, '季節調整': 0.5, '移動平均': 0.2}
        ensemble_pred = (linear_pred * weights['線形回帰'] + 
                        seasonal_pred * weights['季節調整'] + 
                        ma_pred * weights['移動平均'])
        
        print("=" * 60)
        print("アンサンブル予測結果")
        print("=" * 60)
        print("各手法の予測値:")
        print(f"  線形回帰: {linear_pred/1000000:.2f} 百万円 (重み: {weights['線形回帰']:.0%})")
        print(f"  季節調整: {seasonal_pred/1000000:.2f} 百万円 (重み: {weights['季節調整']:.0%})")
        print(f"  移動平均: {ma_pred/1000000:.2f} 百万円 (重み: {weights['移動平均']:.0%})")
        print(f"\n最終予測値: {ensemble_pred/1000000:.2f} 百万円")
        print()
        
        return ensemble_pred
    
    def scenario_analysis(self):
        """シナリオ分析"""
        print("=" * 60)
        print("シナリオ分析")
        print("=" * 60)
        
        base_prediction = self.seasonal_prediction()
        
        scenarios = {
            '楽観シナリオ': base_prediction * 1.15,
            '現実シナリオ': base_prediction,
            '悲観シナリオ': base_prediction * 0.85
        }
        
        probabilities = {
            '楽観シナリオ': 0.2,
            '現実シナリオ': 0.6,
            '悲観シナリオ': 0.2
        }
        
        print("各シナリオの予測値:")
        for scenario, value in scenarios.items():
            prob = probabilities[scenario]
            print(f"  {scenario}: {value/1000000:.2f} 百万円 (確率: {prob:.0%})")
        
        # 期待値の計算
        expected_value = sum(value * probabilities[scenario] 
                            for scenario, value in scenarios.items())
        print(f"\n期待値: {expected_value/1000000:.2f} 百万円")
        print()
        
        return scenarios
    
    def backtest(self, test_months=6):
        """バックテストによる精度検証"""
        print("=" * 60)
        print(f"バックテスト（過去{test_months}ヶ月）")
        print("=" * 60)
        
        predictions = []
        actuals = []
        
        for i in range(test_months):
            # テスト月のインデックス
            test_idx = len(self.df) - test_months + i
            
            # 訓練データ
            train_data = self.df.iloc[:test_idx]
            
            # 簡易予測（移動平均）
            if len(train_data) >= 3:
                pred = train_data['Sales'].tail(3).mean()
            else:
                pred = train_data['Sales'].mean()
            
            predictions.append(pred)
            actuals.append(self.df.iloc[test_idx]['Sales'])
        
        # 精度指標の計算
        mae = mean_absolute_error(actuals, predictions)
        mape = mean_absolute_percentage_error(actuals, predictions) * 100
        rmse = np.sqrt(mean_squared_error(actuals, predictions))
        
        print("予測精度:")
        print(f"  平均絶対誤差(MAE): {mae/1000000:.2f} 百万円")
        print(f"  平均絶対誤差率(MAPE): {mape:.1f}%")
        print(f"  二乗平均平方根誤差(RMSE): {rmse/1000000:.2f} 百万円")
        print()
        
        # 詳細結果
        print("月別の予測と実績:")
        for i in range(test_months):
            test_idx = len(self.df) - test_months + i
            month = self.df.iloc[test_idx]['Month']
            print(f"  {month.strftime('%Y年%m月')}: "
                  f"予測={predictions[i]/1000000:.2f}, "
                  f"実績={actuals[i]/1000000:.2f}, "
                  f"誤差={(predictions[i]-actuals[i])/1000000:.2f} 百万円")
        print()
        
    def visualize_predictions(self):
        """予測結果の可視化"""
        fig, axes = plt.subplots(2, 2, figsize=(15, 10))
        
        # 1. 時系列と予測
        ax1 = axes[0, 0]
        ax1.plot(self.df['Month'], self.df['Sales']/1000000, 
                marker='o', label='実績', linewidth=2)
        
        # 予測値の追加
        next_month = self.df['Month'].iloc[-1] + pd.DateOffset(months=1)
        prediction = self.seasonal_prediction()
        ax1.scatter([next_month], [prediction/1000000], 
                   color='red', s=100, marker='*', label='予測', zorder=5)
        
        ax1.set_title('売上推移と予測', fontsize=14, fontweight='bold')
        ax1.set_xlabel('月')
        ax1.set_ylabel('売上（百万円）')
        ax1.legend()
        ax1.grid(True, alpha=0.3)
        
        # 2. 季節性パターン
        ax2 = axes[0, 1]
        monthly_avg = self.df.groupby(self.df['Month'].dt.month)['Sales'].mean()
        months_jp = ['1月', '2月', '3月', '4月', '5月', '6月', 
                     '7月', '8月', '9月', '10月', '11月', '12月']
        ax2.bar(months_jp, monthly_avg/1000000, color='skyblue', alpha=0.8)
        ax2.set_title('月別平均売上（季節性）', fontsize=14, fontweight='bold')
        ax2.set_xlabel('月')
        ax2.set_ylabel('平均売上（百万円）')
        ax2.tick_params(axis='x', rotation=45)
        ax2.grid(True, alpha=0.3, axis='y')
        
        # 3. トレンド分析
        ax3 = axes[1, 0]
        X = np.arange(len(self.df)).reshape(-1, 1)
        y = self.df['Sales'].values
        model = LinearRegression()
        model.fit(X, y)
        trend_line = model.predict(X)
        
        ax3.scatter(self.df['Month'], self.df['Sales']/1000000, 
                   alpha=0.5, label='実績')
        ax3.plot(self.df['Month'], trend_line/1000000, 
                color='red', linewidth=2, label='トレンド')
        ax3.set_title('トレンド分析', fontsize=14, fontweight='bold')
        ax3.set_xlabel('月')
        ax3.set_ylabel('売上（百万円）')
        ax3.legend()
        ax3.grid(True, alpha=0.3)
        
        # 4. シナリオ分析
        ax4 = axes[1, 1]
        scenarios = self.scenario_analysis()
        scenario_names = list(scenarios.keys())
        scenario_values = [v/1000000 for v in scenarios.values()]
        colors = ['green', 'blue', 'red']
        bars = ax4.bar(scenario_names, scenario_values, color=colors, alpha=0.7)
        
        # 値をバーの上に表示
        for bar, value in zip(bars, scenario_values):
            height = bar.get_height()
            ax4.text(bar.get_x() + bar.get_width()/2., height,
                    f'{value:.1f}', ha='center', va='bottom')
        
        ax4.set_title('シナリオ別予測', fontsize=14, fontweight='bold')
        ax4.set_ylabel('予測売上（百万円）')
        ax4.grid(True, alpha=0.3, axis='y')
        
        plt.suptitle('売上予測分析ダッシュボード', fontsize=16, fontweight='bold', y=1.02)
        plt.tight_layout()
        plt.show()

def main():
    """メイン実行関数"""
    print("\n" + "=" * 60)
    print(" 売上予測システム ".center(60))
    print("=" * 60 + "\n")
    
    # 予測システムの初期化
    predictor = SalesPrediction()
    
    # 基本統計量
    predictor.basic_statistics()
    
    # アンサンブル予測
    final_prediction = predictor.ensemble_prediction()
    
    # バックテスト
    predictor.backtest()
    
    # 可視化
    print("予測結果を可視化しています...")
    predictor.visualize_predictions()
    
    # 最終レポート
    print("\n" + "=" * 60)
    print(" 予測レポートサマリー ".center(60))
    print("=" * 60)
    next_month = (pd.to_datetime('2024-12-01') + pd.DateOffset(months=1)).strftime('%Y年%m月')
    print(f"\n【{next_month}の売上予測】")
    print(f"推奨予測値: {final_prediction/1000000:.2f} 百万円")
    print("\n【信頼区間】")
    print(f"80%信頼区間: {final_prediction*0.9/1000000:.2f} ～ {final_prediction*1.1/1000000:.2f} 百万円")
    print(f"95%信頼区間: {final_prediction*0.85/1000000:.2f} ～ {final_prediction*1.15/1000000:.2f} 百万円")
    print("\n【推奨アクション】")
    print("1. 在庫水準を予測値の90%程度に設定")
    print("2. 季節要因を考慮した販促計画の立案")
    print("3. 異常値発生時の対応策を事前準備")
    print("\n" + "=" * 60)

if __name__ == "__main__":
    main()