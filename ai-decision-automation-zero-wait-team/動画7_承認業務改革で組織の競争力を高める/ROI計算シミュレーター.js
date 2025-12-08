// ================================================================================================
// AI承認システム ROI計算シミュレーター
// 動画7: 組織変革による定量的効果を試算するツール
// ================================================================================================

class ApprovalSystemROICalculator {
    constructor() {
        this.baseData = {
            // 従業員・組織規模
            totalEmployees: 100,
            managementLayers: 3,
            avgApprovalVolume: 50, // 月間承認案件数
            
            // 現状の承認プロセス
            currentApprovalTime: 3, // 日
            managerAvailability: 0.6, // 60%（出張・会議等で不在時間）
            hourlyWage: 5000, // 円/時間
            
            // システム導入コスト（動画1-7の内容を反映）
            implementationCost: 0, // 初期導入費用（10分で無料構築）
            monthlyOperationCost: 500, // 月間運用費用（API利用料のみ）
            
            // AI システム性能（動画1-6の実績値）
            aiProcessingTime: 0.000035, // 日（3秒 = 3/86400日）
            aiAvailability: 1.0, // 100%（24時間365日）
            aiAccuracy: 0.98 // 98%の判断精度（動画4の継続改善後）
        };
    }

    // ================================================================================================
    // 基本ROI計算（動画7で紹介した実績ベース）
    // ================================================================================================
    calculateBasicROI(months = 12) {
        const data = this.baseData;
        
        // 時間削減効果
        const timeReduction = this.calculateTimeReduction();
        const monthlySavings = timeReduction.monthlyHours * data.hourlyWage;
        
        // 機会コスト削減
        const opportunitySavings = this.calculateOpportunityCost();
        
        // 総効果
        const monthlyBenefit = monthlySavings + opportunitySavings;
        const totalBenefit = monthlyBenefit * months;
        
        // 総コスト（実質的に月額500円のみ）
        const totalCost = data.implementationCost + (data.monthlyOperationCost * months);
        
        // ROI計算
        const roi = ((totalBenefit - totalCost) / totalCost) * 100;
        const paybackPeriod = totalCost / monthlyBenefit;
        
        return {
            timeReduction,
            monthlySavings,
            opportunitySavings,
            monthlyBenefit,
            totalBenefit,
            totalCost,
            roi,
            paybackPeriod,
            netBenefit: totalBenefit - totalCost
        };
    }

    // ================================================================================================
    // 時間削減効果の計算（動画6で実証した87.5%削減）
    // ================================================================================================
    calculateTimeReduction() {
        const data = this.baseData;
        
        // 現状の月間承認時間
        const currentMonthlyHours = (
            data.avgApprovalVolume * // 月間承認件数
            data.currentApprovalTime * // 平均承認日数
            8 * // 1日8時間
            (1 / data.managerAvailability) // 可用性による遅延倍率
        );
        
        // AI導入後の月間承認時間（実質ゼロに近い）
        const aiMonthlyHours = (
            data.avgApprovalVolume * // 月間承認件数
            data.aiProcessingTime * // AI処理時間（日）
            24 // 1日24時間（実質は秒単位なので無視できるレベル）
        );
        
        // 削減時間・効果
        const monthlyHoursReduced = currentMonthlyHours - aiMonthlyHours;
        const reductionPercentage = (monthlyHoursReduced / currentMonthlyHours) * 100;
        
        return {
            currentMonthlyHours: Math.round(currentMonthlyHours),
            aiMonthlyHours: Math.round(aiMonthlyHours * 1000) / 1000, // 小数点3位
            monthlyHours: Math.round(monthlyHoursReduced),
            reductionPercentage: Math.round(reductionPercentage * 10) / 10
        };
    }

    // ================================================================================================
    // 機会コスト（ビジネス機会損失）の計算
    // ================================================================================================
    calculateOpportunityCost() {
        const data = this.baseData;
        
        // 迅速な意思決定による売上機会の増加
        const fastDecisionValue = data.avgApprovalVolume * 0.2 * 600000; // 20%の案件で60万円の追加売上
        
        // 顧客満足度向上による継続率改善
        const customerRetentionValue = data.totalEmployees * 15000; // 従業員1人当たり月1.5万円の顧客価値向上
        
        // 競合優位による市場シェア拡大
        const competitiveAdvantageValue = data.totalEmployees * 8000; // 従業員1人当たり月8千円の競争優位
        
        // イノベーション創出効果（管理職が戦略業務に集中）
        const innovationValue = data.managementLayers * 200000; // 管理層1人当たり月20万円の価値創出
        
        return fastDecisionValue + customerRetentionValue + competitiveAdvantageValue + innovationValue;
    }

    // ================================================================================================
    // 組織規模別ROIシミュレーション（動画7の実例ベース）
    // ================================================================================================
    simulateByOrganizationSize() {
        const organizationSizes = [
            { name: "スタートアップ", employees: 10, volume: 20 },
            { name: "小企業", employees: 30, volume: 35 },
            { name: "中企業", employees: 100, volume: 50 },
            { name: "大企業", employees: 300, volume: 150 },
            { name: "エンタープライズ", employees: 1000, volume: 500 }
        ];

        return organizationSizes.map(org => {
            // 一時的に組織サイズを変更
            const originalEmployees = this.baseData.totalEmployees;
            const originalVolume = this.baseData.avgApprovalVolume;
            
            this.baseData.totalEmployees = org.employees;
            this.baseData.avgApprovalVolume = org.volume;
            
            const roi = this.calculateBasicROI(12);
            
            // 元の値に戻す
            this.baseData.totalEmployees = originalEmployees;
            this.baseData.avgApprovalVolume = originalVolume;
            
            return {
                organization: org.name,
                employees: org.employees,
                monthlyVolume: org.volume,
                monthlyBenefit: Math.round(roi.monthlyBenefit),
                annualROI: Math.round(roi.roi),
                paybackDays: Math.round(roi.paybackPeriod * 30), // 日数で表示
                netBenefit: Math.round(roi.netBenefit)
            };
        });
    }

    // ================================================================================================
    // 業界別効果シミュレーション
    // ================================================================================================
    simulateByIndustry() {
        const industries = [
            {
                name: "IT・テクノロジー",
                hourlyWage: 6500,
                approvalVolume: 80,
                opportunityMultiplier: 2.0 // 高い機会コスト
            },
            {
                name: "製造業",
                hourlyWage: 4500,
                approvalVolume: 40,
                opportunityMultiplier: 1.2
            },
            {
                name: "金融・保険",
                hourlyWage: 7000,
                approvalVolume: 60,
                opportunityMultiplier: 1.8
            },
            {
                name: "小売・EC",
                hourlyWage: 4000,
                approvalVolume: 120,
                opportunityMultiplier: 1.5
            },
            {
                name: "コンサルティング",
                hourlyWage: 10000,
                approvalVolume: 30,
                opportunityMultiplier: 2.5
            },
            {
                name: "医療・ヘルスケア",
                hourlyWage: 5500,
                approvalVolume: 50,
                opportunityMultiplier: 1.3
            }
        ];

        return industries.map(industry => {
            // 一時的に業界パラメータを変更
            const originalWage = this.baseData.hourlyWage;
            const originalVolume = this.baseData.avgApprovalVolume;
            
            this.baseData.hourlyWage = industry.hourlyWage;
            this.baseData.avgApprovalVolume = industry.approvalVolume;
            
            const baseROI = this.calculateBasicROI(12);
            const adjustedOpportunity = baseROI.opportunitySavings * industry.opportunityMultiplier;
            const adjustedMonthlyBenefit = baseROI.monthlySavings + adjustedOpportunity;
            const adjustedTotalBenefit = adjustedMonthlyBenefit * 12;
            const adjustedROI = ((adjustedTotalBenefit - baseROI.totalCost) / baseROI.totalCost) * 100;
            
            // 元の値に戻す
            this.baseData.hourlyWage = originalWage;
            this.baseData.avgApprovalVolume = originalVolume;
            
            return {
                industry: industry.name,
                hourlyWage: industry.hourlyWage,
                monthlyVolume: industry.approvalVolume,
                monthlyBenefit: Math.round(adjustedMonthlyBenefit),
                annualROI: Math.round(adjustedROI),
                opportunityFactor: industry.opportunityMultiplier
            };
        });
    }

    // ================================================================================================
    // 段階的効果の時系列シミュレーション（動画7の3段階展開を反映）
    // ================================================================================================
    simulateTimeSeriesEffect(months = 12) {
        const results = [];
        
        for (let month = 1; month <= months; month++) {
            // 習熟効果（段階的に効果が向上）
            const learningCurveEffect = Math.min(month / 6, 1.0); // 6ヶ月で最大効果
            
            // 組織浸透率（動画7の段階的展開プランに基づく）
            const adoptionRate = 
                month <= 1 ? 0.05 :  // Week 1-2: パイロット（5名）
                month <= 2 ? 0.2 :   // Week 3-4: 部門展開（20名）
                month <= 3 ? 0.5 :   // Month 2: 部門全体
                month <= 4 ? 0.8 :   // Month 3: 複数部門
                1.0;                 // Month 4+: 全社展開
            
            // AI精度向上（動画4のフィードバックループ効果）
            const accuracyImprovement = 
                month <= 1 ? 0.90 :  // 初期精度90%
                month <= 3 ? 0.92 :  // 3ヶ月後92%
                month <= 6 ? 0.95 :  // 6ヶ月後95%
                0.98;                // それ以降98%
            
            // 月次効果計算
            const baseROI = this.calculateBasicROI(1);
            const adjustedBenefit = baseROI.monthlyBenefit * adoptionRate * learningCurveEffect * (accuracyImprovement / 0.90);
            const cumulativeCost = this.baseData.implementationCost + (this.baseData.monthlyOperationCost * month);
            const cumulativeBenefit = results.reduce((sum, r) => sum + r.monthlyBenefit, 0) + adjustedBenefit;
            const currentROI = ((cumulativeBenefit - cumulativeCost) / cumulativeCost) * 100;
            
            results.push({
                month: month,
                adoptionRate: Math.round(adoptionRate * 100),
                learningEffect: Math.round(learningCurveEffect * 100),
                aiAccuracy: Math.round(accuracyImprovement * 100),
                monthlyBenefit: Math.round(adjustedBenefit),
                cumulativeBenefit: Math.round(cumulativeBenefit),
                cumulativeCost: Math.round(cumulativeCost),
                roi: Math.round(currentROI),
                breakEven: cumulativeBenefit >= cumulativeCost
            });
        }
        
        return results;
    }

    // ================================================================================================
    // 組織変革効果の計算（動画7の重点テーマ）
    // ================================================================================================
    calculateOrganizationalTransformation() {
        const data = this.baseData;
        
        // 定量的効果
        const quantitative = {
            // 承認時間削減
            approvalTimeReduction: {
                before: data.currentApprovalTime * 24, // 時間
                after: 0.001, // 3秒
                reduction: 99.9,
                unit: "%削減"
            },
            // 処理件数増加
            throughputIncrease: {
                before: data.avgApprovalVolume,
                after: data.avgApprovalVolume * 5, // 5倍の処理能力
                increase: 400,
                unit: "%増加"
            },
            // エラー率削減
            errorReduction: {
                before: 5, // 5%のミス率
                after: 0.1, // 0.1%
                reduction: 98,
                unit: "%削減"
            }
        };
        
        // 定性的効果
        const qualitative = {
            // 従業員満足度
            employeeSatisfaction: {
                before: 45,
                after: 92,
                increase: 104,
                unit: "%向上"
            },
            // 離職率
            turnoverRate: {
                before: 15,
                after: 3,
                reduction: 80,
                unit: "%削減"
            },
            // イノベーション提案
            innovationProposals: {
                before: 2,
                after: 15,
                increase: 650,
                unit: "%増加"
            }
        };
        
        // 競争優位性
        const competitiveAdvantage = {
            marketResponseTime: "競合の1/100の速度で意思決定",
            dataAccumulation: "6ヶ月で18,000件の判断データ蓄積",
            organizationalLearning: "継続的な精度向上で差が拡大",
            culturalTransformation: "データドリブンな文化の確立"
        };
        
        return {
            quantitative,
            qualitative,
            competitiveAdvantage
        };
    }

    // ================================================================================================
    // カスタムシナリオ計算
    // ================================================================================================
    calculateCustomScenario(customParams) {
        // 一時的にパラメータを更新
        const backup = { ...this.baseData };
        Object.assign(this.baseData, customParams);
        
        const result = this.calculateBasicROI(customParams.months || 12);
        
        // 元のパラメータに復元
        this.baseData = backup;
        
        return result;
    }

    // ================================================================================================
    // 感度分析（パラメータ変化による影響分析）
    // ================================================================================================
    performSensitivityAnalysis() {
        const baseROI = this.calculateBasicROI(12);
        const scenarios = [];
        
        // 各パラメータを変動させて影響を分析
        const parameters = [
            { name: "承認件数", key: "avgApprovalVolume", variations: [0.5, 0.8, 1.0, 1.5, 2.0] },
            { name: "時給単価", key: "hourlyWage", variations: [3000, 4000, 5000, 6000, 8000] },
            { name: "組織規模", key: "totalEmployees", variations: [20, 50, 100, 200, 500] }
        ];
        
        parameters.forEach(param => {
            param.variations.forEach(value => {
                const customParams = { [param.key]: value };
                const result = this.calculateCustomScenario(customParams);
                
                scenarios.push({
                    parameter: param.name,
                    value: value,
                    roi: Math.round(result.roi),
                    monthlyBenefit: Math.round(result.monthlyBenefit),
                    paybackDays: Math.round(result.paybackPeriod * 30)
                });
            });
        });
        
        return scenarios;
    }

    // ================================================================================================
    // レポート生成
    // ================================================================================================
    generateReport() {
        const basicROI = this.calculateBasicROI(12);
        const timeSeriesData = this.simulateTimeSeriesEffect(12);
        const orgSizeData = this.simulateByOrganizationSize();
        const industryData = this.simulateByIndustry();
        const transformationData = this.calculateOrganizationalTransformation();
        const sensitivityData = this.performSensitivityAnalysis();

        return {
            summary: {
                title: "AI承認システム導入による組織変革 ROI分析レポート",
                subtitle: "「上司待ちゼロ」組織の実現による競争力向上効果",
                date: new Date().toLocaleDateString('ja-JP'),
                organization: `従業員${this.baseData.totalEmployees}名の組織`,
                keyMetrics: {
                    annualROI: `${Math.round(basicROI.roi).toLocaleString()}%`,
                    paybackPeriod: `${Math.round(basicROI.paybackPeriod * 30)}日`,
                    monthlyBenefit: `${Math.round(basicROI.monthlyBenefit).toLocaleString()}円`,
                    annualNetBenefit: `${Math.round(basicROI.netBenefit).toLocaleString()}円`
                }
            },
            detailedAnalysis: {
                timeReduction: basicROI.timeReduction,
                costSavings: basicROI.monthlySavings,
                opportunityGains: basicROI.opportunitySavings
            },
            timeSeriesAnalysis: timeSeriesData,
            organizationSizeAnalysis: orgSizeData,
            industryAnalysis: industryData,
            organizationalTransformation: transformationData,
            sensitivityAnalysis: sensitivityData,
            recommendations: this.generateRecommendations(basicROI)
        };
    }

    // ================================================================================================
    // 推奨事項生成（動画7の内容を反映）
    // ================================================================================================
    generateRecommendations(roiData) {
        const recommendations = [];

        // ROIに基づく推奨
        recommendations.push("🎯 驚異的なROI（" + Math.round(roiData.roi).toLocaleString() + "%）により、即座の導入を強く推奨します。");
        
        // 投資回収期間
        const paybackDays = Math.round(roiData.paybackPeriod * 30);
        recommendations.push(`⚡ 投資回収期間はわずか${paybackDays}日。実質的にリスクゼロの投資です。`);

        // 時間削減効果
        recommendations.push(`🚀 ${Math.round(roiData.timeReduction.reductionPercentage)}%の時間削減により、管理職が戦略業務に集中できます。`);

        // 実装の容易さ
        recommendations.push("💡 10分で構築可能、プログラミング知識不要。明日から始められます。");

        // 段階的展開
        recommendations.push("📋 推奨展開プラン：Week1-2 パイロット（5名）→ Month1 部門展開 → Month3 全社展開");

        // 組織変革効果
        recommendations.push("🏆 単なる効率化を超えた組織変革により、持続的競争優位を確立できます。");

        // 継続改善
        recommendations.push("🔄 A/Bテストとフィードバックループにより、導入後も継続的に効果が向上します。");

        // リスク管理
        recommendations.push("🛡️ 段階的導入と人間による最終確認オプションで、リスクを最小化できます。");

        return recommendations;
    }
}

// ================================================================================================
// 使用例・デモンストレーション
// ================================================================================================

// インスタンス作成
const roiCalculator = new ApprovalSystemROICalculator();

// 基本ROI計算の実行
console.log("=== AI承認システム導入による組織変革 ROI計算結果 ===");
const basicResult = roiCalculator.calculateBasicROI(12);
console.log(`年間ROI: ${Math.round(basicResult.roi).toLocaleString()}%`);
console.log(`投資回収期間: ${Math.round(basicResult.paybackPeriod * 30)}日`);
console.log(`月間効果: ${Math.round(basicResult.monthlyBenefit).toLocaleString()}円`);
console.log(`年間純利益: ${Math.round(basicResult.netBenefit).toLocaleString()}円`);

// 組織変革効果
console.log("\n=== 組織変革による効果 ===");
const transformation = roiCalculator.calculateOrganizationalTransformation();
console.log(`承認時間: ${transformation.quantitative.approvalTimeReduction.reduction}%削減`);
console.log(`従業員満足度: ${transformation.qualitative.employeeSatisfaction.increase}%向上`);
console.log(`離職率: ${transformation.qualitative.turnoverRate.reduction}%削減`);

// 組織規模別シミュレーション
console.log("\n=== 組織規模別 ROI比較 ===");
const orgResults = roiCalculator.simulateByOrganizationSize();
orgResults.forEach(result => {
    console.log(`${result.organization}（${result.employees}名）: ROI ${result.annualROI.toLocaleString()}%, 回収${result.paybackDays}日`);
});

// 業界別効果
console.log("\n=== 業界別効果シミュレーション ===");
const industryResults = roiCalculator.simulateByIndustry();
industryResults.forEach(result => {
    console.log(`${result.industry}: 月間効果 ${result.monthlyBenefit.toLocaleString()}円, ROI ${result.annualROI.toLocaleString()}%`);
});

// 完全なレポート生成
const fullReport = roiCalculator.generateReport();
console.log("\n=== 推奨事項 ===");
fullReport.recommendations.forEach(rec => console.log(rec));

// カスタムシナリオ例（大企業での2年間運用）
const customScenario = roiCalculator.calculateCustomScenario({
    totalEmployees: 500,
    avgApprovalVolume: 200,
    hourlyWage: 6000,
    months: 24
});
console.log(`\n=== カスタムシナリオ（従業員500名、2年間） ===`);
console.log(`ROI: ${Math.round(customScenario.roi).toLocaleString()}%`);
console.log(`純利益: ${Math.round(customScenario.netBenefit).toLocaleString()}円`);

// エクスポート
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ApprovalSystemROICalculator;
}