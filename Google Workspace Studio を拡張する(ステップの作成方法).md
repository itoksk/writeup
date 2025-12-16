https://developers.google.com/workspace/add-ons/studio?hl=ja

Google Workspace Studio を拡張する
bookmark_border
リリースノート

これらのガイドでは、エージェントが実行できるカスタム ステップを作成して Google Workspace Studio の機能を拡張する方法について説明します。
まず、クイックスタート ガイドの Apps Script を使用して計算機ステップを作成するに沿って操作してください。
クイックスタートを試す
エージェントを使用すると、Google Workspace ユーザーはコードを記述することなく一連の手順を組み合わせて、サービス間でタスクを自動化できます。エージェントを拡張すると、ユーザーがアプリの関数をステップとして追加できるようになります。
たとえば、次のような処理を行うエージェントを使用して、お客様からの質問をトリアージして割り当てることができます。
お客様からメールを受信したときに開始します。
Gemini にメールのトリアージを指示します。
営業チームまたはサポートチームにフォローアップするためのタスクを作成します。

図 1: ユーザーが Gemini を使用して顧客の質問をトリアージするエージェントを構成する。
Workspace Studio のコンセプト
次の用語とコンセプトは、Workspace Studio の主要なコンポーネントを定義します。
エージェント
ユーザーは Workspace Studio でエージェントを構築し、Google Workspace 内外のタスクを自動化します。エージェントは、システム統合、コンテキスト認識に優れており、必要に応じて AI を使用できます。
Step
エージェントの自動化されたプロセス内の単一のステップ。基本的には、開始イベントに続く一連のタスク内の単一のタスクです。各ステップは同期的に実行されます。つまり、シーケンスの次のステップが開始される前に、オペレーションが完了します。ユーザーはステップの順序を設定して、タスクの論理フローをカスタマイズできます。ステップには入出力を含めることができますが、必須ではありません。たとえば、「メールを送信する」、「Chat スペースに投稿する」、「Gemini に質問する」などの手順があります。ステップには、CRM リードの作成など、Google Workspace 以外のタスクを含めることができます。
注: ステップでエージェントを開始することはできません。
入力変数
入力変数はステップによって受信されます。入力変数は、ユーザーがステップを設定する際に、ステップの構成カードで設定します。たとえば、メールアドレス、日時、Gemini プロンプトを収集します。
出力変数
出力変数はステップによって返され、別のステップに送信できます。たとえば、出力変数を使用してメールアドレスを別のステップに渡し、そのステップでメールの受信者を指定します。
動的変数
ユーザーがエージェントを構成するときにのみデータを特定できる変数。たとえば、Google フォームにはさまざまな質問と回答があります。質問と回答の数（およびその内容）は、特定のフォームがエージェントを開始するまで特定できません。動的変数はこのケースに対応しています。
カスタム リソース
複数の変数をグループ化するために定義できるカスタム データ構造。たとえば、CRM リードを作成するには、メールアドレス、住所、名前を含むカスタム リソースを渡します。
カード
アドオンのユーザー インターフェースのビルディング ブロック。カードは、定義されたレイアウト、ボタンなどのインタラクティブな UI 要素、画像などのリッチメディアをサポートしています。カードには、エージェントの構築に役立つ特別な機能があります。
IncludeVariables: 動的変数の組み込みを有効にするプロパティ。
Type: 入力変数が想定するデータの型を定義します。
アクティビティ ログ
エージェントの実行時に何が起こるかを説明します。デフォルトでは、アクティビティ ログには、マニフェストで静的に定義されたスターターまたはステップの名前が含まれます。カスタマイズされたアクティビティ ログをさらに提供することもできます。
作成できるものを見る
エージェントは、Google Workspace のアドオン プラットフォーム上に構築されています。既存のアドオンがある場合は、マニフェストを更新してエージェント固有のセクションを含めることで、その機能を拡張してエージェントを含めることができます。
最初から作成する場合は、クイックスタート ガイドの Apps Script を使用して計算機ステップを作成するをご覧ください。


クイックスタート: Google Apps Script を使用して計算機ステップを作成する

bookmark_border
このクイックスタートでは、Google Apps Script を使用して Workspace Studio のカスタム ステップを作成する方法について説明します。カスタムステップは、2 つの数値と算術演算を入力として受け取り、計算を実行して結果を出力します。

ユーザーがエージェントの一部として計算ステップを構成します。

図 1: エージェントの一部として計算ステップを構成するユーザー。
目標
Google Apps Script を使用して、Workspace Studio のカスタム ステップを作成します。
カスタムステップを独自の Google Workspace 組織にデプロイします。
Workspace Studio でカスタムステップをテストします。
前提条件
Workspace Studio にアクセスできる Google アカウント。
スクリプトを設定する
スクリプトを設定するには、新しい Apps Script プロジェクトを作成し、Cloud プロジェクトに接続します。

次のボタンをクリックして、Calculator クイックスタートの Apps Script プロジェクトを開きます。

プロジェクトを開く

info_outline [概要] をクリックします。

概要ページで、コピーを作成するためのアイコン [コピーを作成] をクリックします。

Apps Script プロジェクトのコピーに名前を付けます。

[Copy of Calculator quickstart] をクリックします。

[プロジェクトのタイトル] に「Calculator quickstart」と入力します。

[名前を変更] をクリックします。

省略可: クイック スタート コードを確認する
前のセクションでは、エージェントのカスタムステップに必要なすべてのアプリケーション コードを含む Apps Script プロジェクト全体をコピーしたため、各ファイルをコピーして貼り付ける必要はありません。

必要に応じて、前のセクションでコピーした各ファイルをここで確認できます。

appsscript.json
マニフェスト ファイル。Apps Script がスクリプトを実行するために必要な基本的なプロジェクト情報を指定する特別な JSON ファイル。

appsscript.json コードを表示する
Calculator.gs
Google Workspace Studio のカスタムステップを定義します。「Calculate」という名前のステップは、2 つの数値と演算を入力として受け取り、計算結果を返します。

Calculator.gs コードを表示する
ステップをデプロイしてテストする
ステップをテストするには、アドオンのテスト デプロイを設定し、ステップをエージェントに追加して、エージェントを実行します。

アドオンのテスト用デプロイを設定します。

Apps Script エディタでスクリプト プロジェクトを開きます。
[デプロイ] > [デプロイをテスト] をクリックします。
[インストール] をクリックします。
下部にある [完了] をクリックします。
他のユーザーにアドオンをテストしてもらうには、Apps Script プロジェクトをそのユーザーのアカウントと共有します（編集権限が必要です）。その後、お客様に上記の手順をご案内します。

インストールすると、アドオンは Agents で直ちに使用できるようになります。アドオンが表示される前に、エージェントの更新が必要になることがあります。アドオンを使用する前に、アドオンを承認する必要もあります。

テスト デプロイの詳細については、未公開のアドオンをインストールするをご覧ください。

[エージェント] を開きます。

ステップを含むエージェントを作成します。

add [New agent] をクリックします。
エージェントの起動方法を選択します。ステップをテストするときは、自分で開始できるスターター（自分宛にメールを送信するなど）を選択します。ステップに入力変数が必要な場合は、スターターの出力の一部として入力変数を構成します。
add [ステップを追加] をクリックします。作成または更新したステップ（[Calculate]）を選択します。
ステップを構成します。計算ステップでは、2 つの値と算術演算を選択します。手順は自動的に保存されます。
ステップの出力をテストするには、別のステップを追加します。たとえば、メール メッセージに出力を追加するには、Gmail の [メッセージを送信] ステップを追加します。[メッセージ] で、add [変数] をクリックし、ステップの出力を選択します。計算ステップで、[add変数] > [ステップ 2: 計算結果] > [計算結果] を選択します。変数は [メッセージ] フィールドにチップとして表示されます。
[有効にする] をクリックします。エージェントを実行する準備が整いました。
エージェントのスターターを起動して、エージェントを実行します。たとえば、メールを受信したときにエージェントが起動する場合は、自分宛てにメールを送信します。

エージェントが想定どおりに実行されることを確認します。ログを確認するには、エージェント ビルダーの [アクティビティ] タブにアクセスします。[アクティビティ] タブでカスタムログを作成する方法については、アクティビティ ログをご覧ください。

次のステップ
Workspace Studio のカスタム ステップを作成してテストできました。以下の操作を行えます。

Gemini にプロンプトを送信して、より複雑なロジックの実装をサポートしてもらい、手順のカスタマイズを続けます。

構成カードを作成して、ステップ構成をカスタマイズします。

アクティビティとエラーをログに記録して、ステップ実行を記録し、トラブルシューティングします。

イベント オブジェクトを確認する: エージェントがステップの実行中に送受信する JSON ペイロードを確認します。
https://script.google.com/home/projects/1CWtKgHL92fN_gpY7-n0Lk-dUtd0eDZw_ucatvghVGrW3NvbEOdJ53BE3/edit?hl=ja




https://developers.google.com/workspace/add-ons/studio/build-a-step?hl=ja
ステップを作成する

bookmark_border
このガイドでは、Google Workspace Studio のエージェントに追加できるステップを作成する方法について説明します。

ステップは、エージェントの一連のタスクの 1 つのステップです。ステップでエージェントを開始できません。

たとえば、算術演算を行うステップについて考えてみましょう。ユーザーに 2 つの値と算術演算を尋ねます。次に、値に対して算術演算を実行し、結果を出力します。

ユーザーがエージェントの一部として計算ステップを構成します。

図 1: エージェントの一部として計算ステップを構成するユーザー。
ステップをビルドするには、アドオンのマニフェスト ファイルでステップを構成し、Google Workspace アドオンのコードでアプリケーション ロジックを記述して、ステップをデプロイしてテストします。

ステップを定義する
ステップを構成するには、マニフェスト ファイルで定義し、アプリケーション ロジックをコードで記述します。

マニフェスト ファイルでステップを定義する
マニフェスト ファイルで、appsscript.json:

onConfigFunction と onExecuteFunction を、アドオンのコード内の対応する関数の名前に設定します。この例では、関数は onConfigCalculate() と onExecuteCalculate() です。
onConfigFunction はステップを設定して構成します。必要に応じて、メールの送信先アドレスなど、ステップの実行に必要なデータをユーザーから収集します。このガイドの例では、2 つの値と算術演算をリクエストしています。
onExecuteFunction はステップを実行します。ユーザーからデータが収集された場合、そのデータはこの関数に渡されます。該当する場合は、出力を返します。このガイドの例では、数学の計算結果を出力します。
必要な入力と出力を設定します。これにより、ステップでデータを収集して後続のステップに送信できます。この例では、ユーザーに 2 つの値と inputs[] で定義された算術演算を尋ねます。outputs[] で定義されている計算結果を出力します。

入力と出力の詳細については、入力変数と出力変数をご覧ください。エージェントがエラーなしで実行されるように、入力変数を検証します。

Calculator ステップのマニフェスト ファイルは次のとおりです。

JSON

{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Calculator",
      "logoUrl": "https://www.gstatic.com/images/branding/productlogos/calculator_search/v1/web-24dp/logo_calculator_search_color_1x_web_24dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "actionElement",
          "state": "ACTIVE",
          "name": "Calculate",
          "description": "Asks the user for two values and a math operation, then performs the math operation on the values and outputs the result.",
          "workflowAction": {
            "inputs": [
              {
                "id": "value1",
                "description": "value1",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              },
              {
                "id": "value2",
                "description": "value2",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              },
              {
                "id": "operation",
                "description": "operation",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "outputs": [
              {
                "id": "result",
                "description": "Calculated result",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              }
            ],
            "onConfigFunction": "onConfigCalculate",
            "onExecuteFunction": "onExecuteCalculate"
          }
        }
      ]
    }
  }
}
次に、コードでステップを定義して、サポート コードを記述します。

コードでステップを定義する
アプリケーション コードで、次の操作を行います。

onConfigFunction を記述します。この例では onConfigCalculate() と呼びます。ユーザーがエージェントにステップを追加すると、エージェント ビルダーでステップの側面を構成できます。ユーザーから必要な情報を収集するために、onConfigFunction は構成カードを定義します。

カードは、アドオンのユーザー インターフェースの構成要素です。カードは、定義されたレイアウト、ボタンなどのインタラクティブな UI 要素、画像などのリッチメディアをサポートしています。カードは、ステップの実行に必要なユーザーのデータ（メールの送信に使用するメールアドレスなど）を取得するために使用します。

OnConfigFunction はカードを返します。このカードは、ユーザーがステップのデータを設定する UI を定義します。この例では、onConfigFunction は、ユーザーに 2 つの値と算術演算を求めるカードを作成します。

この例では、onExecuteCalculate() という名前の onExecuteFunction を記述します。ステップがエージェントで実行されると、OnExecuteFunction が実行されます。onConfigurationFunction で定義されているように、構成時にユーザーが設定した入力値は OnExecuteFunction に渡されます。

提供された入力を使用してタスクを同期的に実行するように OnExecuteFunction() を記述します。OnExecuteFunction() は、エージェントのマニフェストで定義されたすべての出力を返す必要があります。そうしないと、エラーが発生します。

このコードサンプルには、提供された変数をステップの出力として構築して送信するサポート関数 outputVariables() が含まれています。

ステップのテストの準備が整いました。

Calculator ステップのコードは次のとおりです。

Apps Script

/**
 * Generates and displays a configuration card for the sample calculation step.
 *
 * This function creates a card with input fields for two values and a drop-down
 * for selecting an arithmetic operation.
 *
 * The input fields are configured to let the user select outputs from previous
 * steps as input values using the `hostAppDataSource` property.
 */
function onConfigCalculate() {
  const firstInput = CardService.newTextInput()
  .setFieldName("value1")
  .setTitle("First Value")
  .setHostAppDataSource(
    CardService.newHostAppDataSource()
      .setWorkflowDataSource(
        CardService.newWorkflowDataSource()
          .setIncludeVariables(true)
      )
  );
  const secondInput = CardService.newTextInput()
    .setFieldName("value2")
    .setTitle("Second Value").setHostAppDataSource(
      CardService.newHostAppDataSource()
        .setWorkflowDataSource(
          CardService.newWorkflowDataSource()
            .setIncludeVariables(true)
        )
    );
  const selectionInput = CardService.newSelectionInput()
    .setTitle("operation")
    .setFieldName("operation")
    .setType(CardService.SelectionInputType.DROPDOWN)
    .addItem("+", "+", false)
    .addItem("-", "-", true)
    .addItem("x", "x", false)
    .addItem("/", "/", false);

  const sections = CardService.newCardSection()
    .setHeader("Action_sample: Calculate")
    .setId("section_1")
    .addWidget(firstInput)
    .addWidget(selectionInput)
    .addWidget(secondInput)

  var card = CardService.newCardBuilder()
    .addSection(sections)
    .build();

  return card;
}

/**
* Returns output variables from a step.
*
* This function constructs an object that, when returned, sends the
* provided variable values as output from the current step.
* The variable values are logged to the console for debugging purposes.
*/
function outputVariables(variableDataMap) {
const workflowAction = AddOnsResponseService.newReturnOutputVariablesAction()
  .setVariableDataMap(variableDataMap);

const hostAppAction = AddOnsResponseService.newHostAppAction()
  .setWorkflowAction(workflowAction);

const renderAction = AddOnsResponseService.newRenderActionBuilder()
  .setHostAppAction(hostAppAction)
  .build();

return renderAction;
}

/**
 * Executes the calculation step based on the inputs from a flow event.
 *
 * This function retrieves input values and the operation from the flow event,
 * performs the calculation, and returns the result as an output variable.
 * The function logs the event for debugging purposes.
 */
function onExecuteCalculate(event) {
  console.log("output: " + JSON.stringify(event));
  var calculatedValue = 0;
  var value1 = event.workflow.actionInvocation.inputs["value1"].integerValues[0];
  var value2 = event.workflow.actionInvocation.inputs["value2"].integerValues[0];
  var operation = event.workflow.actionInvocation.inputs["operation"].stringValues[0];

  if (operation == "+") {
    calculatedValue = value1 + value2;
  } else if (operation == "-") {
    calculatedValue = value1 - value2;
  } else if (operation == "x") {
    calculatedValue = value1 * value2;
  } else if (operation == "/") {
    calculatedValue = value1 / value2;
  }

  const variableDataMap = { "result": AddOnsResponseService.newVariableData().addIntegerValue(calculatedValue) };

  return outputVariables(variableDataMap);
}
Code Tutor
expand_more
ステップをテストする
ステップをテストするには、アドオンのテスト用デプロイを設定し、ステップをエージェントに追加して、エージェントを実行します。

アドオンのテスト用デプロイを設定します。

Apps Script エディタでスクリプト プロジェクトを開きます。
[デプロイ] > [デプロイをテスト] をクリックします。
[インストール] をクリックします。
下部にある [完了] をクリックします。
他のユーザーにアドオンをテストしてもらうには、Apps Script プロジェクトをそのユーザーのアカウントと共有します（編集権限が必要です）。その後、お客様に上記の手順をご案内します。

インストールすると、アドオンは Agents で直ちに使用できるようになります。アドオンが表示される前に、エージェントの更新が必要になることがあります。アドオンを使用する前に、アドオンを承認する必要もあります。

テスト デプロイの詳細については、未公開のアドオンをインストールするをご覧ください。

[エージェント] を開きます。

ステップを含むエージェントを作成します。

[addNew agent] をクリックします。
エージェントの起動方法を選択します。ステップをテストする際は、自分で開始できるスターター（自分宛にメールを送信するなど）を選択することをおすすめします。ステップに入力変数が必要な場合は、スターターの出力の一部として入力変数を構成します。
add [ステップを追加] をクリックします。作成または更新したステップ（[Calculate]）を選択します。
ステップを構成します。計算ステップでは、2 つの値と算術演算を選択します。手順は自動的に保存されます。
ステップの出力をテストするには、別のステップを追加します。たとえば、メール メッセージに出力を追加するには、Gmail の [メッセージを送信] ステップを追加します。[メッセージ] で、add [変数] をクリックし、ステップの出力を選択します。計算ステップで、[add変数] > [ステップ 2: 計算結果] > [計算結果] を選択します。変数は [メッセージ] フィールドにチップとして表示されます。
[有効にする] をクリックします。エージェントの実行準備が整いました。
エージェントのスターターを起動して、エージェントを実行します。たとえば、メールを受信したときにエージェントが起動する場合は、自分宛てにメールを送信します。

エージェントが想定どおりに実行されることを確認します。ログを確認するには、エージェント ビルダーの [アクティビティ] タブにアクセスします。[アクティビティ] タブでカスタムログを作成する方法については、アクティビティ ログをご覧ください。

関連トピック

バージョンを使用してステップを更新、管理する

bookmark_border
ステップの新しいバージョンを公開しても、そのステップを含む既存のエージェントは自動的に更新されません。ステップを公開した後、以前の動作のサポートを維持するには、変更にバージョンを使用します。

バージョンを使用する必要がある変更には、次のようなものがあります。

新しい必須フィールドを追加する
入力フィールドまたは出力フィールドの非推奨化
string、float、int などのデータ型の変更
ステップの基本的な動作を変更する
バージョニングを実装するには、ステップのマニフェスト ファイルで current_version と min_version を指定します。

current_version: 現在アクティブなデプロイのバージョン番号。
min_version: ステップでサポートされている最も古いバージョン。
次のマニフェストの例は、ステップのバージョンを定義する方法を示しています。

JSON

...
"flows": {
     "workflowElements": [
       {
         "id": "...",
         "state": "...",
         "name": "...",
         "description": "...",
         "version" : {
           "current_version": 3,
           "min_version" : 1
         },
...
実行中に、イベント オブジェクトからバージョン番号を取得し、各バージョンのカスタム動作を定義できます。

Apps Script

/**
 * Executes the step and handles different versions.
 * @param {Object} event The event object.
 */
function onExecute(event) {
  // Get the version ID from the execution metadata.
  const versionId = event.workflow.executionMetadata.versionId;

  // Implement different behavior based on the version.
  if (versionId < 2) {
    // Handle earlier versions
  } else {
    // Handle current and newer versions
  }
}
Code Tutor
expand_more


https://developers.google.com/workspace/add-ons/studio/input-variables?hl=ja

入力変数を使用してデータを収集する

bookmark_border
このガイドでは、入力変数を作成する方法について説明します。

実行するには、手順に特定の情報が必要です。たとえば、メールを送信するにはメールアドレスが必要です。この必要な情報をステップに提供するには、入力変数を定義します。定義された入力変数は、通常、ユーザーがステップを設定する際に、ステップの構成カードでユーザーによって設定されます。

入力変数は、アドオンのマニフェスト ファイルと、ユーザーが入力変数の値を入力できる構成カードを含むコードの 2 か所で定義します。

マニフェスト ファイルで入力変数を定義する
マニフェスト ファイルで、inputs[] 配列を使用して入力変数を指定します。inputs[] 配列の各項目には次のプロパティがあります。

id: 入力変数の固有識別子。エージェントが構成カードの入力要素をこの入力変数に関連付けることができるようにするには、対応するカード要素の名前と一致する必要があります。
description: エンドユーザーに表示する入力変数の説明。
cardinality: 許可される値の数。指定できる値は次のとおりです。
SINGLE: 1 つの値のみが許可されます。
dataType: 受け入れられる値のタイプ。dataType には、データの型を定義するプロパティ basicType があります。有効な値は次のとおりです。
STRING: 英数字の文字列。
INTEGER: 数値。
TIMESTAMP: 「Unix エポックからの経過時間（ミリ秒単位）」形式のタイムスタンプ。たとえば、2025 年 11 月 27 日 16 時 49 分 2 秒（UTC）は 1764262142988 と表されます。
BOOLEAN: true または false。
EMAIL_ADDRESS: dana@example.com 形式のメールアドレス。
次の例では、計算ステップの 3 つの入力変数を定義しています。最初の 2 つの入力変数は整数で、3 つ目は算術演算です。

JSON

{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Calculator",
      "logoUrl": "https://www.gstatic.com/images/branding/productlogos/calculator_search/v1/web-24dp/logo_calculator_search_color_1x_web_24dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "actionElement",
          "state": "ACTIVE",
          "name": "Calculate",
          "description": "Asks the user for two values and a math operation, then performs the math operation on the values and outputs the result.",
          "workflowAction": {
            "inputs": [
              {
                "id": "value1",
                "description": "value1",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              },
              {
                "id": "value2",
                "description": "value2",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              },
              {
                "id": "operation",
                "description": "operation",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "outputs": [
              {
                "id": "result",
                "description": "Calculated result",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              }
            ],
            "onConfigFunction": "onConfigCalculate",
            "onExecuteFunction": "onExecuteCalculate"
          }
        }
      ]
    }
  }
}
コードで入力変数を定義する
このステップのコードには、マニフェスト ファイルの inputs[] 配列で定義された各入力変数に対して 1 つの入力カード ウィジェットを定義する構成カードを返す onConfigFunction() という関数が含まれています。

構成カードで定義された入力ウィジェットには、次の要件があります。

各入力ウィジェットの name は、マニフェスト ファイル内の対応する入力変数の id と一致する必要があります。
入力ウィジェットのカーディナリティは、マニフェスト ファイル内の入力変数の cardinality と一致している必要があります。
入力ウィジェットのデータ型は、マニフェスト ファイルの入力変数の dataType と一致する必要があります。入力変数の dataType が整数の場合、文字列を保持できません。
カード インターフェースの作成については、次のいずれかをご覧ください。

カード作成ツール: カードの作成と定義に使用できるインタラクティブなツール。
Card: Google Workspace アドオン API リファレンス ドキュメント。
カード サービス: スクリプトでカードを構成して作成できる Apps Script サービス。
カードベースのインターフェースの概要: Google Workspace アドオンのデベロッパー向けドキュメント。
次の例では、マニフェスト ファイルで入力変数を定義するで定義されている入力ウィジェットごとに構成カードを返します。

Apps Script

/**
* Generates and displays a configuration card for the sample calculation step.
*
* This function creates a card with input fields for two values and a drop-down
* for selecting an arithmetic operation.
*
* The input fields are configured to let the user select outputs from previous
* workflow steps as input values using the `hostAppDataSource` property.
*/
function onConfigCalculate() {
  const firstInput = CardService.newTextInput()
    .setFieldName("value1") // "FieldName" must match an "id" in the manifest file's inputs[] array.
    .setTitle("First Value")
    .setHostAppDataSource(
      CardService.newHostAppDataSource()
        .setWorkflowDataSource(
          CardService.newWorkflowDataSource()
            .setIncludeVariables(true)
        )
    );

  const secondInput = CardService.newTextInput()
    .setFieldName("value2") // "FieldName" must match an "id" in the manifest file's inputs[] array.
    .setTitle("Second Value")
    .setHostAppDataSource(
      CardService.newHostAppDataSource()
        .setWorkflowDataSource(
          CardService.newWorkflowDataSource()
            .setIncludeVariables(true)
        )
    );

  const selectionInput = CardService.newSelectionInput()
    .setTitle("operation")
    .setFieldName("operation") // "FieldName" must match an "id" in the manifest file's inputs[] array.
    .setType(CardService.SelectionInputType.DROPDOWN)
    .addItem("+", "+", false)
    .addItem("-", "-", true)
    .addItem("x", "x", false)
    .addItem("/", "/", false);

  const sections = CardService.newCardSection()
    .setHeader("Action_sample: Calculate")
    .setId("section_1")
    .addWidget(firstInput)
    .addWidget(selectionInput)
    .addWidget(secondInput)

  let card = CardService.newCardBuilder()
    .addSection(sections)
    .build();

  return card;
}
Code Tutor
expand_more
入力変数を検証する
ベスト プラクティスとして、ユーザーが適切な値を入力したことを検証します。入力変数を検証するをご覧ください。


入力変数を検証する

bookmark_border
このガイドでは、入力変数を検証する方法について説明します。

入力変数を定義する際は、ベスト プラクティスとして、ユーザーが適切な値を入力したことを検証します。たとえば、ユーザーに数値を入力するよう求める場合、a ではなく 1 が入力されたことを確認することで、ステップがエラーなく実行されることを確認できます。

入力変数を検証する方法は 2 つあります。

クライアントサイドの検証: クライアントサイドの検証では、ユーザーの入力をデバイス上で直接検証します。ユーザーはすぐにフィードバックを受け取り、ステップの構成中に、入力のエラーを修正できます。
サーバーサイド検証: サーバーサイド検証では、検証中にサーバーでロジックを実行できます。これは、他のシステムやデータベースのデータなど、クライアントが持っていない情報を検索する必要がある場合に便利です。
クライアントサイドの検証
クライアントサイドの検証を実装する方法は 2 つあります。

ウィジェットに特定の文字数より少ない文字が含まれているか、@ 記号が含まれているかなどの基本的な検証を行うには、Google Workspace アドオンのカード サービスの Validation クラスを呼び出します。
ウィジェットの値を他のウィジェットの値と比較するなど、堅牢な検証を行う場合は、CardService を使用して、次のサポートされているカード ウィジェットに Common Expression Language（CEL）検証を追加できます。
Validation クラスを呼び出す
次の例では、TextInput ウィジェットに 10 文字以下の文字が含まれていることを検証します。

Apps Script

const validation = CardService.newValidation().setCharacterLimit('10').setInputType(
    CardService.InputType.TEXT);
Code Tutor
expand_more
追加の検証オプションについては、CEL 検証を使用します。

CEL 検証
Common Expression Language（CEL）検証では、他のサービスからのデータのルックアップに依存しない入力値のチェックをクライアントサイドにオフロードすることで、サーバーサイド検証のレイテンシなしで入力の即時チェックを実現します。

CEL を使用して、検証結果に応じてウィジェットを表示または非表示にするなどのカードの動作を作成することもできます。この種の動作は、ユーザーが入力内容を修正するのに役立つエラー メッセージを表示または非表示にする場合に便利です。

完全な CEL 検証の構築には、次のコンポーネントが含まれます。

カードの ExpressionData: 定義された条件のいずれかが満たされたときに、指定された検証ロジックとウィジェット トリガー ロジックが含まれます。

Id: 現在のカード内の ExpressionData の一意の識別子。
Expression: 検証ロジックを定義する CEL 文字列（例:"value1 == value2"）。
Conditions: 事前定義された検証結果（SUCCESS または FAILURE）の選択を含む条件のリスト。条件は、共有の actionRuleId を持つ Triggers を介して、ウィジェット側の EventAction に関連付けられます。
カードレベルの EventAction: カードで CEL 検証を有効にし、イベント後のトリガーを介して ExpressionData フィールドを結果ウィジェットに関連付けます。
actionRuleId: この EventAction の一意の ID。
ExpressionDataAction: このアクションが CEL 評価を開始することを示すには、START_EXPRESSION_EVALUATION に設定します。
Trigger: actionRuleId に基づいて Conditions をウィジェット側の EventActions に接続します。
ウィジェット レベルの EventAction: 成功または失敗の条件が満たされたときの検索結果ウィジェットの動作を制御します。たとえば、結果ウィジェットは、検証が失敗した場合にのみ表示されるエラー メッセージを含む TextParagraph にすることができます。

actionRuleId: カード側の Trigger の actionRuleId に一致します。
CommonWidgetAction: ウィジェットの表示 / 非表示の切り替えなど、評価を伴わないアクションを定義します。
UpdateVisibilityAction: ウィジェットの可視性状態（VISIBLE または HIDDEN）を更新するアクション。
次の例は、2 つのテキスト入力が等しいかどうかを確認する CEL 検証を実装する方法を示しています。等しくない場合は、エラー メッセージが表示されます。

failCondition が満たされる（入力が等しくない）と、エラー メッセージ ウィジェットが VISIBLE に設定され、表示されます。
図 1: failCondition が満たされる（入力が等しくない）と、エラー メッセージ ウィジェットが VISIBLE に設定され、表示されます。
successCondition が満たされる（入力が等しい）と、エラー メッセージ ウィジェットは HIDDEN に設定され、表示されません。
図 2: successCondition が満たされる（入力が等しい）と、エラー メッセージ ウィジェットが HIDDEN に設定され、表示されません。


現在のスライド: 1

現在のスライド: 2
アプリケーション コードと JSON マニフェスト ファイルの例を次に示します。

Apps Script
JSON マニフェスト ファイル

function onConfig() {
  // Create a Card
  let cardBuilder = CardService.newCardBuilder();

  const textInput_1 = CardService.newTextInput()
    .setTitle("Input field 1")
    .setFieldName("value1"); // FieldName's value must match a corresponding ID defined in the inputs[] array in the manifest file.
  const textInput_2 = CardService.newTextInput()
    .setTitle("Input field 2")
    .setFieldName("value2"); // FieldName's value must match a corresponding ID defined in the inputs[] array in the manifest file.
  let sections = CardService.newCardSection()
    .setHeader("Enter same values for the two input fields")
    .addWidget(textInput_1)
    .addWidget(textInput_2);

  // CEL Validation

  // Define Conditions
  const condition_success = CardService.newCondition()
    .setActionRuleId("CEL_TEXTINPUT_SUCCESS_RULE_ID")
    .setExpressionDataCondition(
      CardService.newExpressionDataCondition()
      .setConditionType(
        CardService.ExpressionDataConditionType.EXPRESSION_EVALUATION_SUCCESS));
  const condition_fail = CardService.newCondition()
    .setActionRuleId("CEL_TEXTINPUT_FAILURE_RULE_ID")
    .setExpressionDataCondition(
      CardService.newExpressionDataCondition()
      .setConditionType(
        CardService.ExpressionDataConditionType.EXPRESSION_EVALUATION_FAILURE));

  // Define Card-side EventAction
  const expressionDataAction = CardService.newExpressionDataAction()
    .setActionType(
      CardService.ExpressionDataActionType.START_EXPRESSION_EVALUATION);
  // Define Triggers for each Condition respectively
  const trigger_success = CardService.newTrigger()
    .setActionRuleId("CEL_TEXTINPUT_SUCCESS_RULE_ID");
  const trigger_failure = CardService.newTrigger()
    .setActionRuleId("CEL_TEXTINPUT_FAILURE_RULE_ID");

  const eventAction = CardService.newEventAction()
    .setActionRuleId("CEL_TEXTINPUT_EVALUATION_RULE_ID")
    .setExpressionDataAction(expressionDataAction)
    .addPostEventTrigger(trigger_success)
    .addPostEventTrigger(trigger_failure);

  // Define ExpressionData for the current Card
  const expressionData = CardService.newExpressionData()
    .setId("expData_id")
    .setExpression("value1 == value2") // CEL expression
    .addCondition(condition_success)
    .addCondition(condition_fail)
    .addEventAction(eventAction);
  card = card.addExpressionData(expressionData);

  // Create Widget-side EventActions and a widget to display error message
  const widgetEventActionFail = CardService.newEventAction()
    .setActionRuleId("CEL_TEXTINPUT_FAILURE_RULE_ID")
    .setCommonWidgetAction(
      CardService.newCommonWidgetAction()
      .setUpdateVisibilityAction(
        CardService.newUpdateVisibilityAction()
        .setVisibility(
          CardService.Visibility.VISIBLE)));
  const widgetEventActionSuccess = CardService.newEventAction()
    .setActionRuleId("CEL_TEXTINPUT_SUCCESS_RULE_ID")
    .setCommonWidgetAction(
      CardService.newCommonWidgetAction()
      .setUpdateVisibilityAction(
        CardService.newUpdateVisibilityAction()
        .setVisibility(
          CardService.Visibility.HIDDEN)));
  const errorWidget = CardService.newTextParagraph()
    .setText("<font color=\"#FF0000\"><b>Error:</b> Please enter the same values for both input fields.</font>")
    .setVisibility(CardService.Visibility.HIDDEN) // Initially hidden
    .addEventAction(widgetEventActionFail)
    .addEventAction(widgetEventActionSuccess);
  sections = sections.addWidget(errorWidget);

  card = card.addSection(sections);
  // Build and return the Card
  return card.build();
}
Code Tutor
expand_more
注: テキスト入力の fieldName は、マニフェスト ファイルの inputs フィールドで定義された id と一致する必要があります。詳細については、マニフェスト ファイルで入力変数を定義するをご覧ください。
サポートされている CEL 検証ウィジェットとオペレーション
CEL 検証をサポートするカード ウィジェット
サポートされている CEL 検証オペレーション
サポートされていない CEL 検証シナリオ
サーバー側の検証
サーバーサイド検証では、ステップのコードで onSaveFunction() を指定することで、サーバーサイド ロジックを実行できます。ユーザーがステップの構成カードから移動すると、onSaveFunction() が実行され、ユーザーの入力を確認できます。

ユーザーの入力が有効な場合は、saveWorkflowAction を返します。

ユーザーの入力が無効な場合は、エラーの解決方法を説明するエラー メッセージをユーザーに表示する構成カードを返します。

サーバーサイド検証は非同期であるため、ユーザーはエージェントを公開するまで入力エラーに気づかない可能性があります。

マニフェスト ファイル内の各検証済み入力の id は、コード内のカード ウィジェットの name と一致する必要があります。

次の例では、ユーザーのテキスト入力に「@」記号が含まれていることを検証します。

マニフェスト ファイル
マニフェスト ファイルの抜粋では、「onSave」という名前の onSaveFunction() を指定しています。

JSON

{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Server-side validation example",
      "logoUrl": "https://www.gstatic.com/images/branding/productlogos/calculator_search/v1/web-24dp/logo_calculator_search_color_1x_web_24dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "server_validation_demo",
          "state": "ACTIVE",
          "name": "Email address validation",
          "description": "Asks the user for an email address",
          "workflowAction": {
            "inputs": [
              {
                "id": "email",
                "description": "email address",
                "cardinality": "SINGLE",
                "required": true,
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "onConfigFunction": "onConfig",
            "onExecuteFunction": "onExecute",
            "onSaveFunction": "onSave"
          }
        }
      ]
    }
  }
}
アプリケーション コード
このステップのコードには、onSave() という関数が含まれています。ユーザーが入力した文字列に @ が含まれていることを検証します。含まれている場合は、手順を保存します。そうでない場合は、エラーを修正する方法を説明するエラー メッセージを含む構成カードが返されます。

Apps Script

// A helper method to push a card interface
function pushCard(card) {
  const navigation = AddOnsResponseService.newNavigation()
    .pushCard(card);

  const action = AddOnsResponseService.newAction()
    .addNavigation(navigation);

  return AddOnsResponseService.newRenderActionBuilder()
    .setAction(action)
    .build();
}

function onConfig() {
  const emailInput = CardService.newTextInput()
    .setFieldName("email")
    .setTitle("User e-mail")
    .setId("email");

  const saveButton = CardService.newTextButton()
    .setText("Save!")
    .setOnClickAction(
      CardService.newAction()
        .setFunctionName('onSave')
    )

  const sections = CardService.newCardSection()
    .setHeader("Server-side validation")
    .setId("section_1")
    .addWidget(emailInput)
    .addWidget(saveButton);

  let card = CardService.newCardBuilder()
    .addSection(sections)
    .build();

  return pushCard(card);
}

function onExecute(event) {
}

/**
* Validates user input asynchronously when the user
* navigates away from a step's configuration card.
*/
function onSave(event) {
  console.log(JSON.stringify(event, null, 2));

  // "email" matches the input ID specified in the manifest file.
  var email = event.formInputs["email"][0];

  console.log(JSON.stringify(email, null, 2));

  // Validate that the email address contains an "@" sign:
  if (email.includes("@")) {
    // If successfully validated, save and proceed.
    const hostAppAction = AddOnsResponseService.newHostAppAction()
      .setWorkflowAction(
        AddOnsResponseService.newSaveWorkflowAction()
      );

    const textDeletion = AddOnsResponseService.newRemoveWidget()
      .setWidgetId("errorMessage");

    const modifyAction = AddOnsResponseService.newAction()
      .addModifyCard(
        AddOnsResponseService.newModifyCard()
          .setRemoveWidget(textDeletion)
      );

    return AddOnsResponseService.newRenderActionBuilder()
      .setHostAppAction(hostAppAction)
      .setAction(modifyAction)
      .build();

  } else {
    // If the input is invalid, return a card with an error message

    const textParagraph = CardService.newTextParagraph()
      .setId("errorMessage")
      .setMaxLines(1)
      .setText("<font color=\"#FF0000\"><b>Error:</b> Email addresses must include the '@' sign.</font>");

    const emailInput = CardService.newTextInput()
      .setFieldName("email")
      .setTitle("User e-mail")
      .setId("email");

    const saveButton = CardService.newTextButton()
      .setText("Save!")
      .setOnClickAction(
        CardService.newAction().setFunctionName('onSave')
      )

    const sections = CardService.newCardSection()
      .setHeader("Server-side validation")
      .setId("section_1")
      .addWidget(emailInput)
      .addWidget(textParagraph) //Insert the error message
      .addWidget(saveButton);

    let card = CardService.newCardBuilder()
      .addSection(sections)
      .build();

    const navigation = AddOnsResponseService.newNavigation()
      .pushCard(card);

    const action = AddOnsResponseService.newAction()
      .addNavigation(navigation);

    const hostAppAction = AddOnsResponseService.newHostAppAction()
      .setWorkflowAction(
        AddOnsResponseService.newWorkflowValidationErrorAction()
          .setSeverity(AddOnsResponseService.ValidationErrorSeverity.CRITICAL)
      );

    return AddOnsResponseService.newRenderActionBuilder()
      .setHostAppAction(hostAppAction)
      .setAction(action)
      .build();
  }
}
Code Tutor
expand_more
出力変数を使用してステップ間でデータを渡す

bookmark_border
このガイドでは、出力変数を作成する方法について説明します。

出力変数はステップによって返され、別のステップに送信できます。たとえば、メールアドレスを別のステップに渡し、そのステップでメールの受信者を指定します。

出力変数は、アドオンのマニフェスト ファイルと、出力変数を返す関数を含むコードの 2 か所で定義します。

次の例では、2 つの数値と 1 つの算術演算という 3 つの入力変数から計算された数学的結果を返します。

マニフェスト ファイルで出力変数を定義する
Apps Script のマニフェスト ファイルで、outputs[] 配列と onExecuteFunction() を指定します。

outputs[] 配列の各項目には次のプロパティがあります。

id: 出力変数の固有識別子。
description: エンドユーザーに表示する出力変数の説明。
cardinality: 許可される値の数。指定できる値は次のとおりです。
"SINGLE": 1 つの値のみが許可されます。
dataType: 受け入れられる値のタイプ。dataType には、データの型を定義するプロパティ basicType があります。有効な値は次のとおりです。
"STRING": 英数字の文字列。
"INTEGER": 数値。
TIMESTAMP: 「Unix エポックからの経過時間（ミリ秒単位）」形式のタイムスタンプ。たとえば、2025 年 11 月 27 日 16:49:02 UTC は 1764262142988 と表されます。
"BOOLEAN": true または false。
"EMAIL_ADDRESS": dana@example.com 形式のメールアドレス。
次の例では、計算ステップの出力変数を定義しています。出力変数は整数です。

JSON

{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Calculator",
      "logoUrl": "https://www.gstatic.com/images/branding/productlogos/calculator_search/v1/web-24dp/logo_calculator_search_color_1x_web_24dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "actionElement",
          "state": "ACTIVE",
          "name": "Calculate",
          "description": "Asks the user for two values and a math operation, then performs the math operation on the values and outputs the result.",
          "workflowAction": {
            "inputs": [
              {
                "id": "value1",
                "description": "value1",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              },
              {
                "id": "value2",
                "description": "value2",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              },
              {
                "id": "operation",
                "description": "operation",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "outputs": [
              {
                "id": "result",
                "description": "Calculated result",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              }
            ],
            "onConfigFunction": "onConfigCalculate",
            "onExecuteFunction": "onExecuteCalculate"
          }
        }
      ]
    }
  }
}
コードで出力変数を定義する
ステップのコードには onExecuteCalculate() という関数が含まれています。これは、マニフェストで定義されている onExecuteFunction です。ユーザーが入力した 2 つの値に対して算術演算を行い、outputVariables() という関数を使用して、結果を出力変数として返します。

出力変数を返すには、次の要件を満たす JSON を返します。

各出力変数の variableId は、マニフェスト ファイル内の対応する出力変数の id と一致している必要があります。
出力変数の variableData は、マニフェスト ファイル内の対応する出力変数の dataType および cardinality と一致している必要があります。
次の例では、2 つの入力数値の算術値である出力変数を返します。

Apps Script

/**
 * Executes the calculation step based on the inputs from a flow event.
 *
 * This function retrieves input values and the operation from the flow event,
 * performs the calculation, and returns the result as an output variable.
 * The function logs the event for debugging purposes.
 */
function onExecuteCalculate(event) {
  console.log("output: " + JSON.stringify(event));
  var calculatedValue = 0;
  var value1 = event.workflow.actionInvocation.inputs["value1"];
  var value2 = event.workflow.actionInvocation.inputs["value2"];
  var operation = event.workflow.actionInvocation.inputs["operation"].stringValues[0];

  if (operation == "+") {
    calculatedValue = value1 + value2;
  } else if (operation == "-") {
    calculatedValue = value1 - value2;
  } else if (operation == "x") {
    calculatedValue = value1 * value2;
  } else if (operation == "/") {
    calculatedValue = value1 / value2;
  }
  const variableData = AddOnsResponseService.newVariableData()
    .addIntegerValue(calculatedValue);
  
  const workflowAction = AddOnsResponseService.newReturnOutputVariablesAction()
    .addVariableData("result", variableData);

  const hostAppAction = AddOnsResponseService.newHostAppAction()
    .setWorkflowAction(workflowAction);

  return AddOnsResponseService.newRenderActionBuilder()
    .setHostAppAction(hostAppAction)
    .build();
}
Code Tutor
expand_more

カスタム リソースを使用して複雑なデータを表す

bookmark_border
このガイドでは、Google Workspace Studio のカスタム リソースを定義する方法について説明します。

カスタム リソースは、複数の変数をグループ化するために定義できるカスタム データ構造です。ステップの出力が静的な構造を持つ場合は、カスタム リソースで表します。たとえば、CRM リードを作成するには、複数の変数を出力する必要があります。

メールアドレス
番地
名前
CRM リードの作成に必要なすべてのデータが存在することを確認するには、メールアドレス、番地、名前を含むカスタム リソースを出力します。

カスタム リソースを参照として出力する
カスタム リソースを参照として出力することで、完全なカスタム リソース オブジェクトではなく、ID でカスタム リソースを返すことができます。カスタム リソースが大きい場合や複雑な場合は、ID のみを渡すことで、ステップ間で転送されるデータが減り、パフォーマンスが向上します。

カスタム リソースを参照として出力するには、ステップのマニフェスト ファイルとコードを編集します。

マニフェスト ファイルを編集する
マニフェスト ファイルで:

workflowResourceDefinitions を指定し、id、fields[] 配列、providerFunction を割り当てます。workflowResourceDefinitions は、カスタム リソースのデータ型とコンテンツを定義する構造体です。

fields[] 配列内で、カスタム リソースを構成する個々のフィールド（この例では field_1 と field_2）を指定します。

providerFunction の値は、ステップのコード内の関数の名前と一致する必要があります。providerFunction は、必要に応じて実際のカスタム リソース コンテンツを取得します。

JSON

{
  "workflowResourceDefinitions": [
    {
      "id": "resource_id",
      "name": "Custom Resource",
      "fields": [
        {
          "selector": "field_1",
          "name": "Field 1",
          "dataType": {
            "basicType": "STRING"
          }
        },
        {
          "selector": "field_2",
          "name": "Field 2",
          "dataType": {
            "basicType": "STRING"
          }
        }
      ],
      "providerFunction": "onMessageResourceFunction"
    }
  ]
}
outputs[] で、出力変数の動的セットを返す出力変数を指定します。出力変数には、プロパティ resourceType を持つ dataType があります。cardinality の値は SINGLE にする必要があります。

JSON

{
  "outputs": [
    {
      "id": "resource_data",
      "description": "Resource Data",
      "cardinality": "SINGLE",
      "dataType": {
        "resourceType": {
          "workflowResourceDefinitionId": "resource_id"
        }
      }
    }
  ],
}
カスタム リソースを定義する完全なマニフェスト ファイルを次に示します。

JSON

{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Custom Resource (as reference)",
      "logoUrl": "https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "getResourceDataReference",
          "state": "ACTIVE",
          "name": "Custom Resource (as reference)",
          "description": "Output a custom resource as a reference",
          "workflowAction": {
            "outputs": [
              {
                "id": "resource_data",
                "description": "Resource Data",
                "cardinality": "SINGLE",
                "dataType": {
                  "resourceType": {
                    "workflowResourceDefinitionId": "resource_id"
                  }
                }
              }
            ],
            "onConfigFunction": "onConfigResourceFunction",
            "onExecuteFunction": "onExecuteResourceFunction"
          }
        }
      ],
      "workflowResourceDefinitions": [
        {
          "id": "resource_id",
          "name": "Custom Resource",
          "fields": [
            {
              "selector": "field_1",
              "name": "Field 1",
              "dataType": {
                "basicType": "STRING"
              }
            },
            {
              "selector": "field_2",
              "name": "Field 2",
              "dataType": {
                "basicType": "STRING"
              }
            }
          ],
          "providerFunction": "onMessageResourceFunction"
        }
      ]
    }
  }
}
コードを編集
アプリケーション コードで:

必要に応じてカスタム リソース コンテンツを取得する providerFunction（この例では onMessageResourceFunction()）を実装します。ステップのイベント オブジェクトの JSON ペイロードである入力 e を受け取り、そこからカスタム リソース ID を設定します。

Apps Script

function onMessageResourceFunction(e) {
  console.log("Payload in onMessageResourceFunction: " + JSON.stringify(e));

  var resource_id = e.workflow.resourceRetrieval.resourceReference.resourceId;
  let fieldValue_1;
  let fieldValue_2;

  // Using a if-condition to mock a database call.
  if (resource_id == "sample_resource_reference_id") {
    fieldValue_1 = AddOnsResponseService.newVariableData()
      .addStringValue("value1");
    fieldValue_2 = AddOnsResponseService.newVariableData()
      .addStringValue("value2");
  } else {
    fieldValue_1 = AddOnsResponseService.newVariableData()
      .addStringValue("field_1 value not found");
    fieldValue_2 = AddOnsResponseService.newVariableData()
      .addStringValue("field_2 value not found");
  }

  let resourceData = AddOnsResponseService.newResourceData()
    .addVariableData("field_1", fieldValue_1)
    .addVariableData("field_2", fieldValue_2)

  let workflowAction = AddOnsResponseService.newResourceRetrievedAction()
    .setResourceData(resourceData)

  let hostAppAction = AddOnsResponseService.newHostAppAction()
    .setWorkflowAction(workflowAction);

  return AddOnsResponseService.newRenderActionBuilder()
    .setHostAppAction(hostAppAction)
    .build();
}
Code Tutor
expand_more
プロバイダ関数は、API の呼び出しやデータベースの読み取りなどの適切なメカニズムでカスタム リソースの値を取得し、その値を返す必要があります。

ID でカスタム リソースを取得して返すには、onExecuteResourceFunction() に示すように、returnOutputVariablesAction として返します。

Apps Script

function onExecuteResourceFunction(e) {
  console.log("Payload in onExecuteResourceFunction: " + JSON.stringify(e));

  let outputVariables = AddOnsResponseService.newVariableData()
    .addResourceReference("sample_resource_reference_id");

  let workflowAction = AddOnsResponseService.newReturnOutputVariablesAction()
    .addVariableData("resource_data", outputVariables);

  let hostAppAction = AddOnsResponseService.newHostAppAction()
    .setWorkflowAction(workflowAction);

  return AddOnsResponseService.newRenderActionBuilder()
    .setHostAppAction(hostAppAction)
    .build();
}
Code Tutor
expand_more
完全な例を次に示します。

Apps Script

function onConfigResourceFunction() {
  let section = CardService.newCardSection()
    .addWidget(
      CardService.newTextParagraph()
        .setText("This is the Custom Resource Demo card")
    );

  const card = CardService.newCardBuilder()
    .addSection(section)
    .build();

  return card;
}

function onMessageResourceFunction(e) {
  console.log("Payload in onMessageResourceFunction: " + JSON.stringify(e));

  var resource_id = e.workflow.resourceRetrieval.resourceReference.resourceId;
  let fieldValue_1;
  let fieldValue_2;

  // Using a if-condition to mock a database call.
  if (resource_id == "sample_resource_reference_id") {
    fieldValue_1 = AddOnsResponseService.newVariableData()
      .addStringValue("value1");
    fieldValue_2 = AddOnsResponseService.newVariableData()
      .addStringValue("value2");
  } else {
    fieldValue_1 = AddOnsResponseService.newVariableData()
      .addStringValue("field_1 value not found");
    fieldValue_2 = AddOnsResponseService.newVariableData()
      .addStringValue("field_2 value not found");
  }

  let resourceData = AddOnsResponseService.newResourceData()
    .addVariableData("field_1", fieldValue_1)
    .addVariableData("field_2", fieldValue_2)

  let workflowAction = AddOnsResponseService.newResourceRetrievedAction()
    .setResourceData(resourceData)

  let hostAppAction = AddOnsResponseService.newHostAppAction()
    .setWorkflowAction(workflowAction);

  return AddOnsResponseService.newRenderActionBuilder()
    .setHostAppAction(hostAppAction)
    .build();
}

function onExecuteResourceFunction(e) {
  console.log("Payload in onExecuteResourceFunction: " + JSON.stringify(e));

  let outputVariables = AddOnsResponseService.newVariableData()
    .addResourceReference("sample_resource_reference_id");

  let workflowAction = AddOnsResponseService.newReturnOutputVariablesAction()
    .addVariableData("resource_data", outputVariables);

  let hostAppAction = AddOnsResponseService.newHostAppAction()
    .setWorkflowAction(workflowAction);

  return AddOnsResponseService.newRenderActionBuilder()
    .setHostAppAction(hostAppAction)
    .build();
}
Code Tutor
expand_more

動的変数を定義する

bookmark_border
このガイドでは、動的変数を作成する方法について説明します。

可能な場合は、変数をマニフェスト ファイルで 入力変数、出力変数、またはカスタム リソースとして静的に定義する必要があります。ただし、入力の性質が異なるため、ユーザーがエージェントを構成するときにのみ定義できる変数が必要になる場合があります。たとえば、Google フォームの質問と回答の数（およびその内容）は、エージェントの構成時に特定のフォームが選択されるまで特定できません。

動的変数は、マニフェスト ファイルとステップのコードで動的な出力セットを生成する入力を定義することで、これらのケースに対応します。

マニフェスト ファイルで出力変数を定義する
マニフェスト ファイルで、次の手順を行います。

inputs[] で、動的な入力値を受け入れる入力変数を指定します。

outputs[] で、出力変数の動的セットを返す出力変数を指定します。この出力に "workflowResourceDefinitionId": "dynamic_resource_id" の dataType を指定します。

動的変数を処理するカスタム リソースを定義します。"resourceType": "DYNAMIC" と "providerFunction": "onDynamicProviderFunction" を使用して workflowResourceDefinitions を指定します。id は、outputs[] で設定された workflowResourceDefinitionId と一致する必要があります。カスタム リソースの詳細については、カスタム リソースを定義するをご覧ください。

dynamicResourceDefinitionProvider を、ステップのコード内の対応する関数の名前に設定します。この例では、動的入力値を受け入れてカスタム リソースを返す構成カードを定義して返す onDynamicDefinitionFunction() です。

JSON

"flows": {
  "workflowElements" : [{
    "id": "getDynamicVariable",
    "state": "ACTIVE",
    "name": "Get Dynamic Variable",
    "description": "Get Dynamic Variable",
    "workflowAction": {
    "inputs": [
      {
          "id": "dynamic_resource_input",
          "description": "Dynamic Resource Input",
          "cardinality": "SINGLE",
          "dataType": {
            "basicType": "INTEGER"
          }
       }
      ],
      "outputs": [
        {
          "id": "dynamic_resource_output",
          "description": "Dynamic Data",
          "cardinality": "SINGLE",
          "dataType": {
            "resourceType": {
              "workflowResourceDefinitionId": "resource_definition_1"
            }
          }
        }
      ],
      "onConfigFunction": "onDynamicVariableConfigFunction",
      "onExecuteFunction": "onDynamicVariableExecuteFunction"
    }
  }],
  "workflowResourceDefinitions": [{
    "id": "resource_definition_1",
    "name": "Dynamic Resource",
    "providerFunction": "onDynamicProviderFunction",
    "resourceType" : "DYNAMIC"
  }],
  "dynamicResourceDefinitionProvider" : "onDynamicDefinitionFunction",
}
コードで出力変数を定義する
このステップのコードには、次の関数が含まれています。

onDynamicVariableConfigFunction()。動的入力ウィジェットを含む構成カードを作成して返します。この関数の名前は、マニフェスト ファイルの onConfigFunction() の値と一致している必要があります。動的入力ウィジェットの名前は、マニフェスト ファイルで設定された id と一致する必要があります。この動的入力ウィジェットを使用すると、ユーザーはステップの構成時に動的変数を設定できます（Google フォームの選択など）。
onDynamicVariableExecuteFunction()。ステップの実行時に動的変数データを出力として返します。この関数の名前は、マニフェスト ファイルの onExecuteFunction() の値と一致する必要があります。returnOutputVariablesAction の variableData のキーは、マニフェスト ファイルで設定された出力変数の id と一致する必要があります。動的リソースは、イベント オブジェクトの e.workflow.resourceFieldsDefinitionRetrieval にあります。動的リソースのすべての入力は構成時に使用可能である必要があるため、入力で変数を参照することはできません。
onDynamicDefinitionFunction()。イベント オブジェクト（特に resourceFieldsDefinitionRetrieval）から動的変数データを取得し、後続のステップの出力変数の名前を提供する resourceFieldsDefinitionRetrievedAction と、onDynamicProviderFunction() が各出力変数に対応する値を提供できるようにセレクタを返します。resourceId は、マニフェスト ファイルで設定された workflowResourceDefinitions[] 配列内のアイテムの id と一致する必要があります。
onDynamicProviderFunction(): resourceId と workflowResourceDefinitionId にアクセスして、セレクタをキーとして使用し、各出力変数の値を提供します。

Apps Script

function onDynamicVariableConfigFunction() {
  let section = CardService.newCardSection()
    .addWidget(
      CardService.newTextInput()
        .setFieldName("dynamic_resource_input")
        .setTitle("Dynamic Resource Input")
        .setHint("Input a Integer value between 1 and 3\(inclusive\) for corresponding number of output variables")
    );

  const card = CardService.newCardBuilder()
    .addSection(section)
    .build();

  return card;
}

function onDynamicDefinitionFunction(e) {
  console.log("Payload in onDynamicDefinitionFunction: ", JSON.stringify(e));
  var input_value = e.workflow.resourceFieldsDefinitionRetrieval.inputs.dynamic_resource_input.integerValues[0];

  let resourceDefinitions = AddOnsResponseService.newDynamicResourceDefinition()
    .setResourceId("resource_definition_1")
    .addResourceField(
      AddOnsResponseService.newResourceField()
        .setSelector("question_1")
        .setDisplayText("Question 1")
    );

  if (input_value == 2 || input_value == 3) {
    resourceDefinitions = resourceDefinitions
      .addResourceField(
        AddOnsResponseService.newResourceField()
          .setSelector("question_2")
          .setDisplayText("Question 2")
      );
  }
  if (input_value == 3) {
    resourceDefinitions = resourceDefinitions
      .addResourceField(
        AddOnsResponseService.newResourceField()
          .setSelector("question_3")
          .setDisplayText("Question 3")
      );
  }

  let workflowAction = AddOnsResponseService.newResourceFieldsDefinitionRetrievedAction()
    .addDynamicResourceDefinition(resourceDefinitions);

  let hostAppAction = AddOnsResponseService.newHostAppAction()
    .setWorkflowAction(workflowAction);

  let renderAction = AddOnsResponseService.newRenderActionBuilder()
    .setHostAppAction(hostAppAction)
    .build();

  return renderAction;
}

function onDynamicVariableExecuteFunction(e) {
  console.log("Payload in onDynamicVariableExecuteFunction: ", JSON.stringify(e));

  let workflowAction = AddOnsResponseService.newReturnOutputVariablesAction()
    .setVariableDataMap({
      "dynamic_resource_output": AddOnsResponseService.newVariableData()
        .addResourceReference("my_dynamic_resource_id")
    });

  let hostAppAction = AddOnsResponseService.newHostAppAction()
    .setWorkflowAction(workflowAction);

  let renderAction = AddOnsResponseService.newRenderActionBuilder()
    .setHostAppAction(hostAppAction)
    .build();

  return renderAction;
}

function onDynamicProviderFunction(e) {
  console.log("Payload in onDynamicProviderFunction: ", JSON.stringify(e));

  // resourceId == "my_dynamic_resource_id"
  var resourceId = e.workflow.resourceRetrieval.resourceReference.resourceId;
  // workflowResourceDefinitionId == "resource_definition_1"
  var workflowResourceDefinitionId = e.workflow.resourceRetrieval.resourceReference.resourceType.workflowResourceDefinitionId;

  const workflowAction = AddOnsResponseService.newResourceRetrievedAction()
    .setResourceData(
      AddOnsResponseService.newResourceData()
        .addVariableData("question_1", AddOnsResponseService.newVariableData().addStringValue("Answer 1"))
        .addVariableData("question_2", AddOnsResponseService.newVariableData().addStringValue("Answer 2"))
        .addVariableData("question_3", AddOnsResponseService.newVariableData().addStringValue("Answer 3"))
    );

  const hostAppAction = AddOnsResponseService.newHostAppAction()
    .setWorkflowAction(workflowAction);

  const renderAction = AddOnsResponseService.newRenderActionBuilder()
    .setHostAppAction(hostAppAction)
    .build();

  return renderAction;
}
Code Tutor
expand_more
ステップの構成カードを作成する

bookmark_border


このガイドでは、Google Workspace Studio のステップでユーザーがカスタマイズして入力を行える構成カードを作成する方法について説明します。

一般に、構成カードを作成するには、他の Google Workspace アドオンと同様にカード インターフェースを作成します。構成カード インターフェースの作成については、以下をご覧ください。

カード作成ツール: カードの作成と定義に役立つインタラクティブなツール。
Google Workspace アドオン API リファレンス ドキュメントの Card。
カードサービス: スクリプトでカードを構成して作成できる Apps Script サービス。
Google Workspace アドオンのデベロッパー向けドキュメントのカードベースのインターフェース。
一部のカード ウィジェットには、このガイドで説明する Workspace Studio 固有の特別な機能があります。

設定カードを定義する
Apps Script マニフェストとコードの両方で構成カードを定義します。

次の例は、ユーザーに Google Chat スペースの選択を求める構成カードを作成する方法を示しています。

マニフェスト ファイルを編集する
マニフェスト ファイルで workflowElements を定義します。

JSON

{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Chat space selector",
      "logoUrl": "https://www.gstatic.com/images/branding/productlogos/gsuite_addons/v6/web-24dp/logo_gsuite_addons_color_1x_web_24dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "actionElement",
          "state": "ACTIVE",
          "name": "Chat space selector",
          "description": "Lets the user select a space from Google  Chat",
          "workflowAction": {
            "inputs": [
              {
                "id": "chooseSpace",
                "description": "Choose a Chat space",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "onConfigFunction": "onConfigSpacePicker",
            "onExecuteFunction": "onExecuteSpacePicker"
          }
        }
      ]
    }
  }
}
コードを編集
アプリケーション コードでカードを返します。

Apps Script

/**
 * Generates and displays a configuration card to choose a Chat space
 */
function onConfigSpacePicker() {

  const selectionInput = CardService.newSelectionInput()
    .setTitle("First Value")
    .setFieldName("chooseSpace")
    .setType(CardService.SelectionInputType.MULTI_SELECT)
    .setPlatformDataSource(
      CardService.newPlatformDataSource()
        .setHostAppDataSource(
          CardService.newHostAppDataSource()
            .setWorkflowDataSource(
              CardService.newWorkflowDataSource()
                .setIncludeVariables(true)
                .setType(CardService.WorkflowDataSourceType.SPACE)
            )
        )
    );

  const cardSection = CardService.newCardSection()
    .setHeader("Select Chat Space")
    .setId("section_1")
    .addWidget(selectionInput)

  var card = CardService.newCardBuilder()
    .addSection(cardSection)
    .build();

  return card;
}

function onExecuteSpacePicker(e) {
}
Code Tutor
expand_more
入力ウィジェットの予測入力を設定する
SelectionInput ウィジェットのオートコンプリートを設定すると、ユーザーがオプションの一覧から選択しやすくなります。たとえば、ユーザーが米国の都市を入力するメニューで Atl の入力を開始した場合、ユーザーが入力を完了する前に、要素が Atlanta を自動提案できます。最大 100 個のアイテムを自動補完できます。

予測入力の候補は、次のデータソースから取得できます。

サーバーサイドの自動補完: 候補は、ユーザーが定義したサードパーティまたは外部のデータソースから入力されます。
Google Workspace のデータ: Google Workspace ユーザーや Google Chat スペースなどの Google Workspace ソースから候補が入力されます。
サーバーサイドの自動補完
SelectionInput ウィジェットを構成して、外部データソースから予測入力の候補を自動補完できます。たとえば、顧客管理（CRM）システムの販売見込み顧客のリストからユーザーが選択できるようにします。

サーバーサイドのオートコンプリートを実装するには、次の操作を行う必要があります。

データソースを定義する: SelectionInput ウィジェットで、RemoteDataSource を指定する DataSourceConfig を追加します。この構成は、予測入力候補を取得する Apps Script 関数を指します。
予測入力機能を実装する: この関数は、ユーザーが入力フィールドに入力したときにトリガーされます。関数は、ユーザーの入力に基づいて外部データソースをクエリし、候補のリストを返す必要があります。
次の例は、サーバーサイドの自動補完用に SelectionInput ウィジェットを構成する方法を示しています。

Apps Script

// In your onConfig function:
var multiSelect1 =
  CardService.newSelectionInput()
    .setFieldName("value1")
    .setTitle("Server Autocomplete")
    .setType(CardService.SelectionInputType.MULTI_SELECT)
    .setMultiSelectMaxSelectedItems(3)
    .addDataSourceConfig(
      CardService.newDataSourceConfig()
        .setRemoteDataSource(
          CardService.newAction().setFunctionName('getAutocompleteResults')
        )
    )
    .addDataSourceConfig(
      CardService.newDataSourceConfig()
        .setPlatformDataSource(
          CardService.newPlatformDataSource()
            .setHostAppDataSource(
              CardService.newHostAppDataSource()
                .setWorkflowDataSource(
                  CardService.newWorkflowDataSource()
                    .setIncludeVariables(true)
                ))
        )
    );

// ... add widget to card ...
Code Tutor
expand_more
予測入力リクエストを処理する
setFunctionName で指定された関数（getAutocompleteResults）は、ユーザーがフィールドに入力するとイベント オブジェクトを受け取ります。この関数は、次の条件を満たす必要があります。

event.workflow.elementUiAutocomplete.invokedFunction を確認して、想定される関数名と一致していることを確認します。
event.workflow.elementUiAutocomplete.query からユーザーの入力を取得します。
クエリを使用して外部データソースにクエリを実行します。
必要な形式で最大 100 件の候補を返します。
次の例は、ユーザーのクエリに基づいて候補を返す handleAutocompleteRequest() 関数を実装する方法を示しています。

Apps Script

function handleAutocompleteRequest(event) {
  var invokedFunction = event.workflow.elementUiAutocomplete.invokedFunction;
  var query = event.workflow.elementUiAutocomplete.query;

  if (invokedFunction != "getAutocompleteResults" || query == undefined || query == "") {
    return {};
  }

  // Query your data source to get results based on the query
  let autocompleteResponse = AddOnsResponseService.newUpdateWidget()
    .addSuggestion(
      query + " option 1",
      query + "_option1",
      false,
      "https://developers.google.com/workspace/add-ons/images/person-icon.png",
      "option 1 bottom text"
    )
    .addSuggestion(
      query + " option 2",
      query + "_option2",
      false,
      "https://developers.google.com/workspace/add-ons/images/person-icon.png",
      "option 2 bottom text"
    ).addSuggestion(
      query + " option 3",
      query + "_option3",
      false,
      "https://developers.google.com/workspace/add-ons/images/person-icon.png",
      "option 3 bottom text"
    );

  const modifyAction = AddOnsResponseService.newAction()
    .addModifyCard(
      AddOnsResponseService.newModifyCard()
        .setUpdateWidget(autocompleteResponse)
    );

  return AddOnsResponseService.newRenderActionBuilder()
    .setAction(modifyAction)
    .build();
}

// In your onConfig function, handle the autocomplete event
function onConfigAutocompleteTest(event) {
  // Handle autocomplete request
  if (event.workflow && event.workflow.elementUiAutocomplete) {
    return handleAutocompleteRequest(event);
  }

  // ... rest of your card building logic ...
}
Code Tutor
expand_more
Google Workspace データの自動補完
ユーザーの Google Workspace 環境内のデータから予測入力の候補を入力することもできます。

Google Workspace ユーザー: 同じ Google Workspace 組織内のユーザーを入力します。
Google Chat スペース: ユーザーがメンバーになっている Google Chat スペースを入力します。
これを構成するには、SelectionInput ウィジェットで PlatformDataSource を設定し、WorkflowDataSourceType を USER または SPACE に指定します。

Apps Script

// User Autocomplete
var multiSelect2 =
  CardService.newSelectionInput()
    .setFieldName("value2")
    .setTitle("User Autocomplete")
    .setType(CardService.SelectionInputType.MULTI_SELECT)
    .setMultiSelectMaxSelectedItems(3)
    .setPlatformDataSource(
      CardService.newPlatformDataSource()
        .setHostAppDataSource(
          CardService.newHostAppDataSource()
            .setWorkflowDataSource(
              CardService.newWorkflowDataSource()
                .setIncludeVariables(true)
                .setType(CardService.WorkflowDataSourceType.USER)
            ))
    );

// Chat Space Autocomplete
var multiSelect3 =
  CardService.newSelectionInput()
    .setFieldName("value3")
    .setTitle("Chat Space Autocomplete")
    .setType(CardService.SelectionInputType.MULTI_SELECT)
    .setMultiSelectMaxSelectedItems(3)
    .setPlatformDataSource(
      CardService.newPlatformDataSource()
        .setHostAppDataSource(
          CardService.newHostAppDataSource()
            .setWorkflowDataSource(
              CardService.newWorkflowDataSource()
                .setIncludeVariables(true)
                .setType(CardService.WorkflowDataSourceType.SPACE)
            ))
    );
Code Tutor
expand_more
例: 予測入力のタイプを組み合わせる
次の例は、3 つの SelectionInput ウィジェットを含むカードを作成する onConfig 関数を示しています。この関数は、サーバーサイド、ユーザー、スペースの自動補完を示しています。

JSON
Apps Script
json { "timeZone": "America/Los_Angeles", "exceptionLogging": "STACKDRIVER", "runtimeVersion": "V8", "addOns": { "common": { "name": "Autocomplete Demo", "logoUrl": "https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png", "useLocaleFromApp": true }, "flows": { "workflowElements": [ { "id": "autocomplete_demo", "state": "ACTIVE", "name": "Autocomplete Demo", "description": "Provide autocompletion in input fields", "workflowAction": { "inputs": [ { "id": "value1", "description": "A multi-select field with autocompletion", "cardinality": "SINGLE", "dataType": { "basicType": "STRING" } } ], "onConfigFunction": "onConfigAutocomplete", "onExecuteFunction": "onExecuteAutocomplete" } } ] } } }

Workspace Studio 固有の機能
一部のカード ウィジェットには、Workspace Studio 固有の特別な機能があります。詳細については、こちらをご覧ください。

TextInput と SelectionInput
TextInput ウィジェットと SelectionInput ウィジェットには、Workspace Studio 固有の次の機能があります。

includeVariables: ユーザーが前のステップから変数を選択できるようにするブール値プロパティ。後の手順で変数ピッカーを表示するには、開始イベントと少なくとも 1 つの対応する出力変数の両方を変数にマッピングする必要があります。
type: 候補を自動補完する列挙値。サポートされている値は次のとおりです。
USER: ユーザーの連絡先に登録されている人物の予測入力の候補を提供します。
SPACE: ユーザーがメンバーとして所属している Google Chat スペースのオートコンプリート候補を提供します。
includeVariables と type の両方が設定されている場合、入力フィールドはそれらのエクスペリエンスを組み合わせます。ユーザーは、一致する type の変数を選択して、その予測入力の候補を表示できます。

Google Chat スペースの候補の自動補完。
図 1: スペースを選択する際に、ユーザーがオートコンプリートの候補を確認している様子。
[変数] メニューでは、前のステップの出力変数を選択できます。
図 2: ユーザーが [➕変数] プルダウンから前のステップの出力変数を選択する。


現在のスライド: 1

現在のスライド: 2
カードに関する考慮事項と制限事項
エージェントを拡張するアドオンでは、popCard()、pushCard()、updateCard() などのカード ナビゲーションはサポートされていません。

SelectionInput が変数ピッカーで使用されている場合、ウィジェットは "type": "MULTI_SELECT" のみをサポートします。構成カードの他の場所では、SelectionInput は SelectionType のすべての値をサポートしています。


設定カードを更新する

bookmark_border
このガイドでは、ボタンのクリックやメニューからのアイテムの選択などのユーザー アクションに応じて、構成カードを動的に更新する方法について説明します。

カード セクションやウィジェットを挿入、削除、置換して、ユーザー入力に適応するレスポンシブ インターフェースを作成できます。たとえば、整数が想定される入力フィールドに文字列を入力したユーザーに検証エラー メッセージを表示するようにカード インターフェースを更新し、ユーザーが整数を入力した後にメッセージを非表示にするように再度更新できます。

カードのセクションとウィジェットを変更する
カードを更新するには、ウィジェット アクション（onClickAction など）で、変更手順を含む RenderActions オブジェクトを返す関数を呼び出す必要があります。

カード セクションでは、次の変更を行うことができます。

セクションを挿入する: setInsertSection を使用して、カードの上部または ID で指定された既存のセクションの下にセクションを追加します。
セクションを削除する: setRemoveSection を使用して、ID で指定されたセクションを削除します。
セクションを置き換える: setReplaceSection で ID を指定して、既存のセクションを新しいセクションに置き換えます。
カード ウィジェットでは、次の変更を行うことができます。

ウィジェットを挿入する: setInsertWidget を使用して、ID で指定された既存のウィジェットの前後にウィジェットを追加します。
ウィジェットを削除する: setRemoveWidget を使用して、ID で指定されたウィジェットを削除します。
ウィジェットを置き換える: 既存のウィジェットを setReplaceWidget を含む新しいウィジェットに置き換えます。
例: セクションとウィジェットを挿入、削除する
次の例では、ウィジェットとセクションの挿入または削除によってカードを変更する関数を呼び出すボタンを含む構成カードを作成します。

JSON
Apps Script

{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Test Project",
      "logoUrl": "https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "modify_card",
          "state": "ACTIVE",
          "name": "Modify Card",
          "workflowAction": {
            "inputs": [
              {
                "id": "value1",
                "description": "The first input",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              },
              {
                "id": "value2",
                "description": "The second number",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              },
              {
                "id": "value3",
                "description": "The third number",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "outputs": [
              {
                "id": "result",
                "description": "Modify Card result",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "onConfigFunction": "onConfig",
            "onExecuteFunction": "onExecute"
          }
        }
      ]
    }
  }
}

Google Picker で Google ドライブのファイルやフォルダを選択する

bookmark_border
ユーザーが Google ドライブからファイルやフォルダを選択できるようにするには、Google Picker を使用するように SelectionInput ウィジェットを構成します。このガイドでは、アドオンの構成カードで Google Picker を設定する方法について説明します。

Google Picker を構成する
選択入力ウィジェットで Google ドライブからファイルやフォルダを選択できるようにするには、CommonDataSource と DriveDataSourceSpec を使用して PlatformDataSource を構成する必要があります。

CommonDataSource を DRIVE に設定します。これにより、選択入力のソースとして Google ドライブが指定されます。
（省略可）ユーザーが選択できるファイル形式を指定するには、DriveDataSourceSpec を追加します。次の商品アイテムタイプを 1 つ以上指定できます。
DOCUMENTS
SPREADSHEETS
PRESENTATIONS
PDFS
FORMS
FOLDERS
例: スプレッドシートと PDF を選択する
次の例では、ユーザーが Google ドライブから複数のスプレッドシートまたは PDF ファイルを選択できる構成カードを作成します。このステップを実行すると、選択したアイテムのファイル ID が出力変数として返されます。

JSON
Apps Script

{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Drive Picker Demo",
      "logoUrl": "https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "file_selection",
          "state": "ACTIVE",
          "name": "File selection",
          "workflowAction": {
            "inputs": [
              {
                "id": "drive_picker_1",
                "description": "Choose a file from Google Drive",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "outputs": [
              {
                "id": "fileId",
                "description": "The id of the selected file",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "onConfigFunction": "onConfig",
            "onExecuteFunction": "onExecute"
          }
        }
      ]
    }
  }
}
アクティビティとエラーをログに記録する

bookmark_border
このガイドでは、Workspace Studio の [Activity] タブで実行に失敗したステップのトラブルシューティングに役立つカスタムログとエラー メッセージを作成する方法について説明します。

デフォルトでは、[アクティビティ] タブには、マニフェスト ファイルで定義されているステップの名前が記録されます。ステップ実行中に何が起こったかを把握できるように、ステップのカスタムログも作成する必要があります。ユーザーがステップの実行中に予期しない動作が発生した場合、ログは発生した内容を理解するのに役立ちます。

有用なログエントリには次の 2 つの属性があります。

ステップで作成または更新されたリソースへのハイパーリンクを含むチップ。たとえば、ステップで Google ドキュメントを作成する場合は、チップを使用して作成した Google ドキュメントにリンクします。
ステップの実行が失敗した理由と問題の解決方法を説明する詳細なエラー メッセージ。
次のコードサンプルは、onExecuteFunctionCreateDocument() が実行の成功とエラーを [アクティビティ] タブに記録する方法を示しています。

マニフェスト ファイルは次のとおりです。

JSON

{
  "timeZone": "America/Los_Angeles",
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Log and Error Demo",
      "logoUrl": "https://www.gstatic.com/images/branding/productlogos/gsuite_addons/v6/web-24dp/logo_gsuite_addons_color_1x_web_24dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "log_and_error_demo",
          "state": "ACTIVE",
          "name": "Log and Error Demo",
          "description": "Display a log message when executed successfully, display a error message and retry execution instead.",
          "workflowAction": {
            "inputs": [
              {
                "id": "value1",
                "description": "value1",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "INTEGER"
                }
              }
            ],
            "outputs": [
              {
                "id": "result",
                "description": "execution result",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "onConfigFunction": "onConfigFunctionCreateDocument",
            "onExecuteFunction": "onExecuteFunctionCreateDocument"
          }
        }
      ]
    }
  }
}
アプリケーション ロジックのコードは次のとおりです。

Apps Script

function onConfigFunctionCreateDocument() {
  const firstInput = CardService.newTextInput()
    .setFieldName("value1")
    .setTitle("First Value") //"FieldName" must match an "id" in the manifest file's inputs[] array.
    .setHint("Input 1 to successfully execute the step, 0 to fail the step and return an error.")
    .setHostAppDataSource(
      CardService.newHostAppDataSource()
        .setWorkflowDataSource(
          CardService.newWorkflowDataSource()
            .setIncludeVariables(true)
        )
    );

  let cardSection = CardService.newCardSection()
    .addWidget(firstInput);

  return CardService.newCardBuilder()
    .addSection(cardSection)
    .build();
}

function onExecuteFunctionCreateDocument(event) {

  // true if the document is successfully created, false if something goes wrong.
  var successfulRun = event.workflow.actionInvocation.inputs["value1"].integerValues[0];
  console.log("The user input is: ", successfulRun);

  // If successful, return an activity log linking to the created document.
  if (successfulRun == 1) {
    let logChip = AddOnsResponseService.newTextFormatChip()
      .setTextFormatIcon(
        AddOnsResponseService.newTextFormatIcon()
          .setMaterialIconName("edit_document")
      )
      .setUrl("https://docs.google.com/document/d/{DOCUMENT}")
      .setLabel("Mock Document");

    let output = AddOnsResponseService.newVariableData()
      .addStringValue("Created Google Doc");

    const workflowAction = AddOnsResponseService.newReturnOutputVariablesAction()
      .addVariableData("result", output)
      // Set the user-facing error log
      .setLog(
        AddOnsResponseService.newWorkflowTextFormat()
          .addTextFormatElement(
            AddOnsResponseService.newTextFormatElement()
              .setText("Created Google Doc")
          )
          .addTextFormatElement(
            AddOnsResponseService.newTextFormatElement()
              .setTextFormatChip(logChip)
          )
          .addTextFormatElement(
            AddOnsResponseService.newTextFormatElement()
              .setText("Created doc detailing how to improve product.")
          )
      );

    let hostAppAction = AddOnsResponseService.newHostAppAction()
      .setWorkflowAction(workflowAction);

    return AddOnsResponseService.newRenderActionBuilder()
      .setHostAppAction(hostAppAction)
      .build();
  }
  // Otherwise, return an activity log containing an error explaining what happened and how to resolve the issue.
  else {
    let errorChip = AddOnsResponseService.newTextFormatChip()
      .setTextFormatIcon(
        AddOnsResponseService.newTextFormatIcon()
          .setMaterialIconName("file_open")
      )
      .setLabel("Mock Document");

    const workflowAction = AddOnsResponseService.newReturnElementErrorAction()
      .setErrorActionability(AddOnsResponseService.ErrorActionability.ACTIONABLE)
      .setErrorRetryability(AddOnsResponseService.ErrorRetryability.NOT_RETRYABLE)
      // Set the user-facing error log
      .setErrorLog(
        AddOnsResponseService.newWorkflowTextFormat()
          .addTextFormatElement(
            AddOnsResponseService.newTextFormatElement()
              .setText("Failed to create Google Doc.")
          )
          .addTextFormatElement(
            AddOnsResponseService.newTextFormatElement()
              .setTextFormatChip(errorChip)
          )
          .addTextFormatElement(
            AddOnsResponseService.newTextFormatElement()
              .setText("Unable to create Google Document because OAuth verification failed. Grant one of these authorization scopes and try again: https://www.googleapis.com/auth/documents, \nhttps://www.googleapis.com/auth/drive, \nhttps://www.googleapis.com/auth/drive.file")
          )
      );

    let hostAppAction = AddOnsResponseService.newHostAppAction()
      .setWorkflowAction(workflowAction);

    return AddOnsResponseService.newRenderActionBuilder()
      .setHostAppAction(hostAppAction)
      .build();
  }
}
Code Tutor
expand_more

エラーを処理する

bookmark_border
このガイドでは、ステップの実行時に発生するエラーを管理する方法について説明します。失敗したステップを解決するためにユーザーの操作が必要かどうか、または再試行できるかどうかを指定できます。

実行可能なエラーを返す: ユーザーをステップの構成カードに誘導するボタンをエラーログに追加し、ユーザーが入力を変更してエラーを解決できるようにします。エラーを対応可能としてマークするには、AddOnsResponseService.ErrorActionability.ACTIONABLE を返します。エラーを対応不可としてマークするには、AddOnsResponseService.ErrorActionability.NOT_ACTIONABLE を返します。
エラー後に手順を再試行する: エージェントは、停止するまでに手順を最大 5 回再試行します。エラーを再試行可能としてマークするには、AddOnsResponseService.ErrorRetryability.RETRYABLE を返します。再試行できないエラーをマークするには、AddOnsResponseService.ErrorRetryability.NOT_RETRYABLE を返します。
チップ、ハイパーリンク、スタイル設定されたテキストを含むカスタム エラーログを作成して、エラーに関するより詳細なコンテキストをユーザーに提供することもできます。

対処可能なエラーを返す
次の例では、ユーザーに負の数を求めるステップを作成します。ユーザーが正の数を入力すると、ステップは、ユーザーに入力を修正するよう求める実行可能なエラーを返します。

次のマニフェスト ファイルは、ステップの入力、出力、構成と実行のために呼び出す関数を定義しています。

JSON

{
  "timeZone": "America/Toronto",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Retry Errors Example",
      "logoUrl": "https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "handle_error_action",
          "state": "ACTIVE",
          "name": "Handle Error Action",
          "description": "To notify the user that some error has occurred",
          "workflowAction": {
            "inputs": [
              {
                "id": "value1",
                "description": "The input from the user",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "outputs": [
              {
                "id": "output_1",
                "description": "The output",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "onConfigFunction": "onConfiguration",
            "onExecuteFunction": "onExecution"
          }
        }
      ]
    }
  }
}
次のコードは、構成カードを作成し、エラー処理などの実行ロジックを処理します。

Apps Script

/**
 * Returns a configuration card for the step.
 * This card contains a text input field for the user.
 */
function onConfiguration() {
  let section = CardService.newCardSection()
    .addWidget(CardService.newTextInput()
      .setFieldName("value1")
      .setId("value1")
      .setTitle("Please input negative numbers!"));
  const card = CardService.newCardBuilder().addSection(section).build();
  return card;
}

/**
 * Gets an integer value from variable data, handling both string and integer formats.
 * @param {Object} variableData The variable data object from the event.
 * @return {number} The extracted integer value.
 */
function getIntValue(variableData) {
  if (variableData.stringValues) {
    return parseInt(variableData.stringValues[0]);
  }
  return variableData.integerValues[0];
}

/**
 * Executes the step.
 * If the user input is a positive number, it throws an error and returns an
 * actionable error message. Otherwise, it returns the input as an output variable.
 * @param {Object} e The event object.
 */
function onExecution(e) {
  try {
    var input_value = getIntValue(e.workflow.actionInvocation.inputs["value1"]);
    if (input_value > 0) {
      throw new Error('Found invalid positive input value!');
    }

    // If execution is successful, return the output variable and a log.
    const styledText_1 = AddOnsResponseService.newStyledText()
      .setText("Execution completed, the number you entered was: ")
      .addStyle(AddOnsResponseService.TextStyle.ITALIC)
      .addStyle(AddOnsResponseService.TextStyle.UNDERLINE)

    const styledText_2 = AddOnsResponseService.newStyledText()
      .setText(input_value)
      .setFontWeight(AddOnsResponseService.FontWeight.BOLD)

    const workflowAction = AddOnsResponseService.newReturnOutputVariablesAction()
      .setVariableDataMap(
        {
          "output_1": AddOnsResponseService.newVariableData()
            .addStringValue(input_value)
        }
      )
      .setLog(AddOnsResponseService.newWorkflowTextFormat()
        .addTextFormatElement(
          AddOnsResponseService.newTextFormatElement()
            .setStyledText(styledText_1)
        ).addTextFormatElement(
          AddOnsResponseService.newTextFormatElement()
            .setStyledText(styledText_2)
        ));

    let hostAppAction = AddOnsResponseService.newHostAppAction()
      .setWorkflowAction(workflowAction);

    return AddOnsResponseService.newRenderActionBuilder()
      .setHostAppAction(hostAppAction)
      .build();

  } catch (err) {
    Logger.log('An error occurred: ' + err.message);

    // If an error occurs, return an actionable error action.
    const workflowAction = AddOnsResponseService.newReturnElementErrorAction()
      // Sets the user-facing error message.
      .setErrorLog(
        AddOnsResponseService.newWorkflowTextFormat()
          .addTextFormatElement(
            AddOnsResponseService.newTextFormatElement()
              .setText("Failed due to invalid input values!"))
      )
      // Makes the error actionable, allowing the user to correct the input.
      .setErrorActionability(AddOnsResponseService.ErrorActionability.ACTIONABLE)
      // Specifies that the error is not automatically retried.
      .setErrorRetryability(AddOnsResponseService.ErrorRetryability.NOT_RETRYABLE)

    let hostAppAction = AddOnsResponseService.newHostAppAction()
      .setWorkflowAction(workflowAction);

    return AddOnsResponseService.newRenderActionBuilder()
      .setHostAppAction(hostAppAction).build();

  } finally {
    console.log("Execution completed")
  }
}
Code Tutor
expand_more
エラー後にステップを再試行する
次の例では、一時的な障害をシミュレートするステップをビルドします。エラーが発生すると、ステップは再試行可能なエラーを返します。これにより、エージェントはステップを再実行します。

マニフェスト ファイルでステップを定義します。

JSON

{
  "timeZone": "America/Toronto",
  "dependencies": {},
  "exceptionLogging": "STACKDRIVER",
  "runtimeVersion": "V8",
  "addOns": {
    "common": {
      "name": "Retry Errors Example",
      "logoUrl": "https://www.gstatic.com/images/icons/material/system/1x/pets_black_48dp.png",
      "useLocaleFromApp": true
    },
    "flows": {
      "workflowElements": [
        {
          "id": "retryError",
          "state": "ACTIVE",
          "name": "Retry an error",
          "description": "Simulates a temporary failure and retries the step.",
          "workflowAction": {
            "inputs": [
              {
                "id": "value1",
                "description": "Any input value",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "outputs": [
              {
                "id": "output_1",
                "description": "The output",
                "cardinality": "SINGLE",
                "dataType": {
                  "basicType": "STRING"
                }
              }
            ],
            "onConfigFunction": "onRetryConfiguration",
            "onExecuteFunction": "onRetryExecution"
          }
        }
      ]
    }
  }
}
次のコードは、構成カードを構築し、再試行ロジックを処理します。

Apps Script

/**
 * Returns a configuration card for the step.
 * This card contains a text input field for the user.
 */
function onRetryConfiguration() {
  let section = CardService.newCardSection()
    .addWidget(CardService.newTextInput()
      .setFieldName("value1")
      .setId("value1")
      .setTitle("Enter any value"));
  const card = CardService.newCardBuilder().addSection(section).build();
  return card;
}

/**
 * Executes the step and simulates a transient error.
 * This function fails 80% of the time. When it fails, it returns an
 * error that can be retried.
 * @param {Object} e The event object.
 */
function onRetryExecution(e) {
  try {
    // Simulate a transient error that fails 80% of the time.
    if (Math.random() < 0.8) {
      throw new Error('Simulated transient failure!');
    }

    // If execution is successful, return the output variable and a log.
    var input_value = e.workflow.actionInvocation.inputs["value1"].stringValues[0];

    const styledText = AddOnsResponseService.newStyledText()
      .setText(`Execution succeeded for input: ${input_value}`);

    const workflowAction = AddOnsResponseService.newReturnOutputVariablesAction()
      .setVariables({
        "output_1": AddOnsResponseService.newVariableData()
          .addStringValue(input_value)
      })
      .setLog(AddOnsResponseService.newWorkflowTextFormat()
        .addTextFormatElement(
          AddOnsResponseService.newTextFormatElement()
            .setStyledText(styledText)
        ));

    let hostAppAction = AddOnsResponseService.newHostAppAction()
      .setWorkflowAction(workflowAction);

    return AddOnsResponseService.newRenderActionBuilder()
      .setHostAppAction(hostAppAction)
      .build();

  } catch (err) {
    // If a transient error occurs, return an error message saying the step tries to run again.
    Logger.log('A error occurred, trying to run the step again: ' + err.message);

    const workflowAction = AddOnsResponseService.newReturnElementErrorAction()
      // Sets the user-facing error message.
      .setErrorLog(
        AddOnsResponseService.newWorkflowTextFormat()
          .addTextFormatElement(
            AddOnsResponseService.newTextFormatElement()
              .setText("A temporary error occurred. The step will be retried."))
      )
      // Makes the error not actionable by the user.
      .setErrorActionability(AddOnsResponseService.ErrorActionability.NOT_ACTIONABLE)
      // Specifies that the error is automatically retried.
      .setErrorRetryability(AddOnsResponseService.ErrorRetryability.RETRYABLE);

    let hostAppAction = AddOnsResponseService.newHostAppAction()
      .setWorkflowAction(workflowAction);

    return AddOnsResponseService.newRenderActionBuilder()
      .setHostAppAction(hostAppAction)
      .build();
  } finally {
    console.log("Execution completed")
  }
}
Code Tutor
expand_more

Workspace Studio のイベント オブジェクト

bookmark_border
このガイドでは、Workspace Studio のイベント オブジェクトの例を示します。

エージェントは、Google Workspace アドオン全体で使用される共通の Google Workspace アドオン イベント オブジェクトでイベント パラメータを送信します。共通イベント オブジェクトについて詳しくは、Google Workspace アドオンのイベント オブジェクトをご覧ください。

フロー イベント オブジェクトには、次のオブジェクトが含まれます。

workflow: エージェントの実行、作成、更新、削除、カスタム リソースのリクエスト時に発生する内容の詳細を示すイベント。発生した内容に応じて、次のオブジェクトがあります。

actionInvocation: ステップが実行されます。
resourceRetrieval: エージェントからカスタム リソースがリクエストされます。
次の表に、エージェントの操作に基づいてどのイベント オブジェクトが入力されるかを示します。

イベント オブジェクト	WorkflowAction	WorkflowResource
actionInvocation	OnExecuteFunction()

Action で OnExecuteFunction が呼び出されたときに呼び出されます。	なし
resourceRetrieval	なし	providerFunction()

ワークフローからリソースがリクエストされたときに呼び出されます。
actionInvocation
参考までに、actionInvocation を示すイベントの例を次に示します。

JSON

{
    "workflow": {
        "triggerEventSource": "TRIGGER_EVENT_SOURCE_AUTOMATED",
        "actionInvocation": {
            "inputs": {
                "operation": {
                    "stringValues": [
                        "+"
                    ]
                },
                "value2": {
                    "integerValues": [
                        2
                    ]
                },
                "value1": {
                    "integerValues": [
                        2
                    ]
                }
            }
        }
    },
    "userLocale": "en",
    "hostApp": "flows",
    "clientPlatform": "web",
    "commonEventObject": {
        "timeZone": {
            "offset": -14400000,
            "id": "America/New_York"
        },
        "userLocale": "en-US",
        "hostApp": "WORKFLOW",
        "platform": "WEB"
    },
    "userCountry": "US",
    "userTimezone": {
        "id": "America/New_York",
        "offSet": "-14400000"
    }
}
resourceRetrieval
resourceRetrieval を示すイベントの例を次に示します。

JSON

{
    "workflow": {
        "resourceRetrieval": {
            "resourceReference": {
                "resourceType": {
                    "workflowBundleId": "workflow_bundle_id",
                    "workflowResourceDefinitionId": "workflow_resource_definition_id"
                },
                "resourceId": "resource_id"
            }
        }
    },
    "userLocale": "en",
    "hostApp": "flows",
    "clientPlatform": "web",
    "commonEventObject": {
        "timeZone": {
            "offset": -14400000,
            "id": "America/New_York"
        },
        "userLocale": "en-US",
        "hostApp": "WORKFLOW",
        "platform": "WEB"
    },
    "userCountry": "US",
    "userTimezone": {
        "id": "America/New_York",
        "offSet": "-14400000"
    }
}
この情報は役に立ちましたか？

Google Workspace アドオンをサードパーティ サービスに接続する

bookmark_border
リンクのプレビューから作成されたカスタム認証カード。会社のロゴ、説明、ログイン ボタンが含まれています。
サードパーティ サービスのリンクをプレビューするアドオンのログイン カード インターフェース。

Google Workspace アドオンが認証を必要とするサードパーティ サービスまたは API に接続する場合、アドオンはユーザーにログインとアクセス権の承認を求めることができます。

このページでは、認可フロー（OAuth など）を使用してユーザーを認証する方法について説明します。これには次の手順が含まれます。

承認が必要なタイミングを検出します。
ユーザーにサービスへのログインを求めるカード インターフェースを返します。
ユーザーがサービスまたは保護されたリソースにアクセスできるように、アドオンを更新します。
アドオンでユーザー ID のみが必要な場合は、Google Workspace ID またはメールアドレスを使用してユーザーを直接認証できます。認証にメールアドレスを使用するには、JSON リクエストの検証をご覧ください。Google Apps Script を使用してアドオンをビルドした場合は、OAuth2 for Google Apps Script ライブラリ（OAuth1 バージョンもあります）を使用すると、このプロセスを簡単にできます。

認可が必要であることを検出する
アドオンを使用する際、ユーザーが保護されたリソースにアクセスできない理由はさまざまです。たとえば、次のような理由が考えられます。

サードパーティ サービスに接続するためのアクセス トークンがまだ生成されていないか、期限切れです。
アクセス トークンがリクエストされたリソースをカバーしていません。
アクセス トークンがリクエストに必要なスコープをカバーしていない。
アドオンは、ユーザーがログインしてサービスにアクセスできるように、このようなケースを検出する必要があります。

Apps Script でビルドしている場合、OAuth ライブラリの hasAccess() 関数を使用すると、サービスにアクセスできるかどうかを確認できます。また、UrlFetchApp fetch() リクエストを使用する場合は、muteHttpExceptions パラメータを true に設定できます。これにより、リクエストの失敗時にリクエストが例外をスローすることを防ぎ、返された HttpResponse オブジェクトでリクエスト レスポンス コードとコンテンツを調べることができます。

サービスにログインするようユーザーに求める
アドオンで認証が必要であることが検出された場合、アドオンは カード インターフェースを返して、ユーザーにサービスへのログインを求める必要があります。ログインカードは、ユーザーをリダイレクトして、インフラストラクチャでサードパーティの認証と認可のプロセスを完了する必要があります。

HTTP エンドポイントを使用してアドオンを構築する場合は、Google ログインで宛先アプリを保護し、ログイン時に発行されるID トークンを使用してユーザー ID を取得することをおすすめします。sub クレームにはユーザーの一意の ID が含まれており、アドオンの ID と関連付けることができます。

アサートされたユーザー ID を受け入れる前に、必ずトークンの完全性を検証してください。
ログインカードをビルドして返す
サービスのログインカードには、Google の基本認証カードを使用することも、カードをカスタマイズして組織のロゴなどの追加情報を表示することもできます。アドオンを一般公開する場合は、カスタムカードを使用する必要があります。

基本的な承認カード
次の図は、Google の基本的な認証カードの例を示しています。

Example Account の基本認証プロンプト。このプロンプトは、アドオンが追加情報を表示するために、アカウントへのアクセスをユーザーに許可してもらう必要があることを示しています。

基本認証カードをユーザーに表示するには、オブジェクト AuthorizationError を返す必要があります。次のコードは、AuthorizationError オブジェクトの例を示しています。

Apps Script
JSON

CardService.newAuthorizationException()
    .setAuthorizationUrl('AUTHORIZATION_URL')
    .setResourceDisplayName('RESOURCE_DISPLAY_NAME')
    .throwException();
次のように置き換えます。

AUTHORIZATION_URL: 認証を処理するウェブアプリの URL。
RESOURCE_DISPLAY_NAME: 保護されたリソースまたはサービスの表示名。この名前は、認証プロンプトでユーザーに表示されます。たとえば、RESOURCE_DISPLAY_NAME が Example Account の場合、「このアドオンは追加情報を表示するため、Example アカウントへのアクセス許可を必要としています」というメッセージが表示されます。
承認が完了すると、保護されたリソースにアクセスするためにアドオンを更新するよう求めるメッセージが表示されます。

Google Chat で承認カードを返す
アドオンが Google Chat を拡張し、ユーザーが Google Chat 内でアドオンを実行する場合、ユーザーは手動で更新しなくても承認プロセスを完了できます。トリガーが メッセージ、スペースに追加、またはアプリ コマンドの場合、Google Chat は以前の実行の自動再試行をサポートします。これらのトリガーの場合、アドオンはイベント ペイロードで completeRedirectUri を受け取ります。自動再試行をトリガーするには、構成 URL で completeRedirectUri をエンコードする必要があります。この URL にリダイレクトすると、Google Chat に構成リクエストが完了したことが通知され、Google Chat は前の実行を再試行できます。

ユーザーが元のメッセージで指定された configCompleteRedirectUrl に正常にリダイレクトされると、Google Chat は次の手順を実行します。

開始ユーザーに表示されたプロンプトを消去します。
元のイベント オブジェクトを同じアドオンに 2 回送信します。
構成 URL で completeRedirectUri をエンコードしない場合でも、ユーザーは認証フローを完了できます。ただし、Google Chat は以前の実行を再試行しません。ユーザーはアドオンを手動で再度呼び出す必要があります。

次のコードサンプルは、Chat 用アプリがオフライン OAuth2 認証情報をリクエストし、データベースに保存して、ユーザー認証で API 呼び出しを行う方法を示しています。

Apps Script
Node.js
Python
Java
GitHub で表示

カスタム承認カード
承認プロンプトを変更するには、サービスのログイン エクスペリエンス用のカスタムカードを作成します。

注: カスタム認証カードは Google Chat ではサポートされていません。Chat ユーザーにログインを求めるには、アドオンで基本認証カードを使用する必要があります。
アドオンを一般公開する場合は、Chat 以外のすべての Google Workspace ホスト アプリケーションでカスタム認証カードを使用する必要があります。Google Workspace Marketplace の公開要件について詳しくは、アプリ審査についてをご覧ください。

返されるカードは、次のことを行う必要があります。

アドオンがユーザーに代わって Google 以外のサービスにアクセスする権限を求めていることを、ユーザーに明確に伝えます。
承認された場合にアドオンで何ができるかを明確にする。
ユーザーをサービスの認証 URL に誘導するボタンや同様のウィジェットが含まれている。このウィジェットの機能がユーザーにわかりやすいようにしてください。
上記のウィジェットは、OpenLink オブジェクトの OnClose.RELOAD 設定を使用して、認証の受信後にアドオンが再読み込みされるようにする必要があります。
認証プロンプトから開かれるすべてのリンクは HTTPS を使用する必要があります。
次の画像は、アドオンのホームページのカスタム認証カードの例を示しています。カードには、ロゴ、説明、ログインボタンが含まれています。

Cymbal Labs のカスタム認証カード。会社のロゴ、説明、ログインボタンが含まれています。

次のコードは、このカスタムカードの例の使用方法を示しています。

Apps Script
JSON

function customAuthorizationCard() {
    let cardSection1Image1 = CardService.newImage()
        .setImageUrl('LOGO_URL')
        .setAltText('LOGO_ALT_TEXT');

    let cardSection1Divider1 = CardService.newDivider();

    let cardSection1TextParagraph1 = CardService.newTextParagraph()
        .setText('DESCRIPTION');

    let cardSection1ButtonList1Button1 = CardService.newTextButton()
        .setText('Sign in')
        .setBackgroundColor('#0055ff')
        .setTextButtonStyle(CardService.TextButtonStyle.FILLED)
        .setAuthorizationAction(CardService.newAuthorizationAction()
            .setAuthorizationUrl('AUTHORIZATION_URL'));

    let cardSection1ButtonList1 = CardService.newButtonSet()
        .addButton(cardSection1ButtonList1Button1);

    let cardSection1TextParagraph2 = CardService.newTextParagraph()
        .setText('TEXT_SIGN_UP');

    let cardSection1 = CardService.newCardSection()
        .addWidget(cardSection1Image1)
        .addWidget(cardSection1Divider1)
        .addWidget(cardSection1TextParagraph1)
        .addWidget(cardSection1ButtonList1)
        .addWidget(cardSection1TextParagraph2);

    let card = CardService.newCardBuilder()
        .addSection(cardSection1)
        .build();
    return [card];
}

function startNonGoogleAuth() {
    CardService.newAuthorizationException()
        .setAuthorizationUrl('AUTHORIZATION_URL')
        .setResourceDisplayName('RESOURCE_DISPLAY_NAME')
        .setCustomUiCallback('customAuthorizationCard')
        .throwException();
  }
Code Tutor
expand_more
次のように置き換えます。

LOGO_URL: ロゴまたは画像の URL。公開 URL である必要があります。
LOGO_ALT_TEXT: ロゴまたは画像の代替テキスト（Cymbal Labs Logo など）。
DESCRIPTION: ユーザーにログインを促す行動を促すフレーズ（Sign in to get started など）。
ログイン ボタンを更新するには:
AUTHORIZATION_URL: 認証を処理するウェブアプリの URL。
省略可: ボタンの色を変更するには、color フィールドの RGBA 浮動小数点値を更新します。Apps Script の場合は、16 進数値を使用して setBackgroundColor() メソッドを更新します。
TEXT_SIGN_UP: アカウントを持っていないユーザーにアカウントの作成を促すテキスト。例: New to Cymbal Labs? <a href=\"https://www.example.com/signup\">Sign up</a> here
Google Workspace アプリ全体でサードパーティのログインを管理する
Google Workspace アドオンの一般的な用途の 1 つは、Google Workspace のホスト アプリケーション内からサードパーティ システムとやり取りするためのインターフェースを提供することです。

サードパーティ システムでは、ユーザー ID、パスワード、その他の認証情報を使用してログインすることが求められることがよくあります。ユーザーが Google Workspace ホストの 1 つを使用しているときにサードパーティ サービスにログインした場合、別の Google Workspace ホストに切り替えたときに再度ログインする必要がないようにする必要があります。

Apps Script で構築している場合は、ユーザー プロパティまたは ID トークンを使用して、ログイン リクエストの繰り返しを防止できます。詳細については、以降のセクションで説明します。

ユーザー プロパティ
ユーザーのログインデータを Apps Script のユーザー プロパティに保存できます。たとえば、ログイン サービスから独自の JSON ウェブトークン（JWT）を作成してユーザー プロパティに記録したり、サービスのユーザー名とパスワードを記録したりできます。

ユーザー プロパティは、アドオンのスクリプト内でそのユーザーのみがアクセスできるようにスコープ設定されています。他のユーザーや他のスクリプトはこれらのプロパティにアクセスできません。詳しくは、PropertiesService をご覧ください。

ID トークン
Google ID トークンをサービスのログイン認証情報として使用できます。これはシングル サインオンを実現する方法の 1 つです。ユーザーは Google ホストアプリを使用しているため、すでに Google にログインしています。

Google 以外の OAuth 構成の例
次の Apps Script コードサンプルは、OAuth を必要とする Google 以外の API を使用するようにアドオンを構成する方法を示しています。このサンプルでは、OAuth2 for Apps Script ライブラリを使用して、API にアクセスするためのサービスを構築します。

Apps Script

/**
* Attempts to access a non-Google API using a constructed service
* object.
*
* If your add-on needs access to non-Google APIs that require OAuth,
* you need to implement this method. You can use the OAuth1 and
* OAuth2 Apps Script libraries to help implement it.
*
* @param {String} url         The URL to access.
* @param {String} method_opt  The HTTP method. Defaults to GET.
* @param {Object} headers_opt The HTTP headers. Defaults to an empty
*                             object. The Authorization field is added
*                             to the headers in this method.
* @return {HttpResponse} the result from the UrlFetchApp.fetch() call.
*/
function accessProtectedResource(url, method_opt, headers_opt) {
  var service = getOAuthService();
  var maybeAuthorized = service.hasAccess();
  if (maybeAuthorized) {
    // A token is present, but it may be expired or invalid. Make a
    // request and check the response code to be sure.

    // Make the UrlFetch request and return the result.
    var accessToken = service.getAccessToken();
    var method = method_opt || 'get';
    var headers = headers_opt || {};
    headers['Authorization'] =
        Utilities.formatString('Bearer %s', accessToken);
    var resp = UrlFetchApp.fetch(url, {
      'headers': headers,
      'method' : method,
      'muteHttpExceptions': true, // Prevents thrown HTTP exceptions.
    });

    var code = resp.getResponseCode();
    if (code >= 200 && code < 300) {
      return resp.getContentText("utf-8"); // Success
    } else if (code == 401 || code == 403) {
      // Not fully authorized for this action.
      maybeAuthorized = false;
    } else {
      // Handle other response codes by logging them and throwing an
      // exception.
      console.error("Backend server error (%s): %s", code.toString(),
                    resp.getContentText("utf-8"));
      throw ("Backend server error: " + code);
    }
  }

  if (!maybeAuthorized) {
    // Invoke the authorization flow using the default authorization
    // prompt card.
    CardService.newAuthorizationException()
        .setAuthorizationUrl(service.getAuthorizationUrl())
        .setResourceDisplayName("Display name to show to the user")
        .throwException();
  }
}

/**
* Create a new OAuth service to facilitate accessing an API.
* This example assumes there is a single service that the add-on needs to
* access. Its name is used when persisting the authorized token, so ensure
* it is unique within the scope of the property store. You must set the
* client secret and client ID, which are obtained when registering your
* add-on with the API.
*
* See the Apps Script OAuth2 Library documentation for more
* information:
*   https://github.com/googlesamples/apps-script-oauth2#1-create-the-oauth2-service
*
*  @return A configured OAuth2 service object.
*/
function getOAuthService() {
  return OAuth2.createService('SERVICE_NAME')
      .setAuthorizationBaseUrl('SERVICE_AUTH_URL')
      .setTokenUrl('SERVICE_AUTH_TOKEN_URL')
      .setClientId('CLIENT_ID')
      .setClientSecret('CLIENT_SECRET')
      .setScope('SERVICE_SCOPE_REQUESTS')
      .setCallbackFunction('authCallback')
      .setCache(CacheService.getUserCache())
      .setPropertyStore(PropertiesService.getUserProperties());
}

/**
* Boilerplate code to determine if a request is authorized and returns
* a corresponding HTML message. When the user completes the OAuth2 flow
* on the service provider's website, this function is invoked from the
* service. In order for authorization to succeed you must make sure that
* the service knows how to call this function by setting the correct
* redirect URL.
*
* The redirect URL to enter is:
* https://script.google.com/macros/d/<Apps Script ID>/usercallback
*
* See the Apps Script OAuth2 Library documentation for more
* information:
*   https://github.com/googlesamples/apps-script-oauth2#1-create-the-oauth2-service
*
*  @param {Object} callbackRequest The request data received from the
*                  callback function. Pass it to the service's
*                  handleCallback() method to complete the
*                  authorization process.
*  @return {HtmlOutput} a success or denied HTML message to display to
*          the user.
*/
function authCallback(callbackRequest) {
  var authorized = getOAuthService().handleCallback(callbackRequest);
  if (authorized) {
    return HtmlService.createHtmlOutput(
      'Success!');
  } else {
    return HtmlService.createHtmlOutput('Denied');
  }
}

/**
* Unauthorizes the non-Google service. This is useful for OAuth
* development/testing.  Run this method (Run > resetOAuth in the script
* editor) to reset OAuth to re-prompt the user for OAuth.
*/
function resetOAuth() {
  getOAuthService().reset();
}
Code Tutor
expand_more
警告: OAuth サービス（setCache(...)）にキャッシュが設定されていることを確認してください。キャッシュが設定されていない場合、認証フローが完了した後、アドオンが古いデータで再読み込みされ、再度認証がリクエストされる可能性があります。

Apps Script Google Workspace アドオンをテストしてデバッグする

bookmark_border
アドオンを公開すると、ユーザーはホスト アプリケーションまたは Google Workspace Marketplace からアドオンをインストールできるようになります。公開する前に、アドオンを拡張するホスト アプリケーション内で、開発したアドオンをテストします。

このページでは、テストまたは個人使用のために、開発中のアドオン（未公開アドオンまたはデベロッパー アドオン）をインストールする方法について説明します。Apps Script IDE のデバッガとブレークポイントを使用してアドオンをデバッグすることもできます。

前提条件
アドオンのスクリプト プロジェクトに対する編集者権限が必要です。
組織内の他のユーザーがアドオンをテストできるようにするには、スクリプト プロジェクトに対する編集権限を付与します。アクセス権の付与について詳しくは、他のデベロッパーとのコラボレーションをご覧ください。
非公開のアドオンをインストールする
未公開のアドオンは、Apps Script の [デプロイ] ダイアログからインストールできます。

テスト用に未公開の Google Workspace アドオンをインストールする手順は次のとおりです。

Apps Script エディタでスクリプト プロジェクトを開きます。
[デプロイ] > [デプロイをテスト] をクリックします。
[インストール] をクリックします。
下部にある [完了] をクリックします。
Apps Script プロジェクトを他のユーザーのアカウントと共有することで、他のユーザーにアドオンのテストを許可できます（編集権限が必要です）。その後、上記の手順に沿って操作するようお客様に伝えます。

インストールすると、アドオンは拡張するホスト アプリケーションですぐに使用できるようになります。アドオンが表示される前に、ホスト アプリケーションのタブを更新する必要がある場合があります。アドオンを使用する前に、承認も必要です。プロジェクトがすでに承認されている場合は、ScriptApp.invalidateAuth を使用して既存の承認を無効にし、アドオンできめ細かい OAuth 機能をテストできるようにします。

非公開のアドオンをアンインストールする
未公開のアドオンのデプロイをアンインストールする手順は次のとおりです。

Apps Script エディタでスクリプト プロジェクトを開きます。
[デプロイ] > [デプロイをテスト] をクリックします。
[アンインストール] をクリックします。
下部にある [完了] をクリックします。
これらの手順を行うと、デプロイが直ちに削除され、アドオンがホスト アプリケーションに表示されなくなります。インストール手順を繰り返すことで、デプロイをいつでも再インストールできます。

ベスト プラクティスを試す
Google Workspace アドオンをテストする際は、アドオン開発のベスト プラクティスに必ず従ってください。また、次のことも必ず行ってください。

アドオンが拡張するすべてのホスト アプリケーションで、カード ナビゲーション フローを徹底的にテストします。ユーザーがコンテキスト間、コンテキストなしのカードとコンテキストありのカード間を移動する際に、アドオンの動作が正しいことを確認します。

テストデータの例を使用する: アドオンの動作を評価します。

アドオンがサードパーティの API や他のサービスに接続する場合は、そのサービスにアクセスでき、想定どおりに動作することを確認します。アドオンが認証とログインの詳細を正しく処理していることを確認します。

エラー条件が適切に処理されるようにします。必要に応じてエラーカードを使用します。

アドオンのパフォーマンスに注意してください。コードを変更してアドオンの動作が遅くなった場合は、その機能を削除するか、作り直す必要があるかもしれません。

おすすめの方法

bookmark_border


アドオンの設計に関するガイドに沿って、ユーザーの全体的なエクスペリエンスを改善します。

一般的なベスト プラクティス
開発するすべてのアドオンで、次のベスト プラクティスを使用することをおすすめします。

 開始前にアドオンの所有権を判断する
アドオンは Apps Script プロジェクトで定義されます。このプロジェクトは、特定のアカウントが所有するか、共有ドライブに配置する必要があります。アドオンをコーディングする前に、プロジェクトを所有するアカウントと、パブリッシャーとして機能するアカウントを決定します。また、共同編集者として機能するアカウントを決定し、それらのアカウントがスクリプト プロジェクトとそれに関連付けられた Google Cloud プロジェクトにアクセスできることを確認します。

注: アドオンの所有権を計画することが重要です。アドオンのオーナーが組織を退職する場合は、所有権が移行されていることを確認する必要があります。所有権が移行されていないと、アドオンの更新と管理ができなくなる可能性があります。そのため、組織のアドオンを所有して公開するために、組織アカウントを作成することをおすすめします。共有ドライブを使用してスクリプト プロジェクト オーナーとして機能することもできますが、アドオン パブリッシャーとして機能するアカウントが必要です。
Google Workspace を拡張する、複製しない
アドオンは、拡張する Google Workspace アプリケーションに新しい機能を提供したり、複雑なタスクを自動化したりすることを目的としています。アプリ内にすでに存在する機能を単純に複製するアドオンや、ワークフローを大幅に改善しないアドオンは、公開のためのアドオン審査に合格しない可能性があります。

スコープを狭くする
スコープを明示的に定義する場合は、可能な限り制限の少ないスコープ セットを選択してください。たとえば、読み取りアクセス権のみが必要な場合は、https://www.googleapis.com/auth/calendar スコープを使用してユーザーのカレンダーへの完全アクセス権をアドオンがリクエストしないようにします。読み取り専用アクセスの場合は、https://www.googleapis.com/auth/calendar.readonly スコープを使用します。

 ライブラリに過度に依存しない
Apps Script のライブラリを使用すると、すべての Apps Script コードが 1 つのスクリプト プロジェクトに含まれている場合よりも、アドオンの実行速度が遅くなる可能性があります。Apps Script ライブラリはアドオンで動作しますが、使用するとパフォーマンスが低下する可能性があります。不要なライブラリをプロジェクトに含めないようにし、アドオンのライブラリへの依存を減らす方法を検討します。

上記のレイテンシは、サーバーサイド ライブラリとして使用される Apps Script プロジェクトにのみ適用されます。jQuery などのクライアントサイド JavaScript ライブラリは、このレイテンシが発生することなく自由に使用できます。

Google Workspace アドオンのベスト プラクティス
以下のベスト プラクティスは、Google Workspace アドオンとカード サービスの使用にのみ適用されます。

 使用するカードを減らす
アドオンで使用するカードが多すぎると、ナビゲーションの構成が複雑になり、管理が難しくなります。

必要以上にカードを作成しないようにします。

 ウィジェット作成関数を使用する
Card などの複雑な UI オブジェクトを作成するコードを記述する場合は、そのコードを独自の関数に配置することを検討してください。この作成関数は、オブジェクトをビルドして返すだけです。これにより、UI を更新する必要があるときに、そのオブジェクトをすばやく再生成できます。カード サービスでビルダークラスを使用した後は、必ず build() を呼び出してください。

カードはシンプルに
カードにウィジェットが多すぎると、画面のスペースを占有しすぎて、使いづらくなる可能性があります。大きなカード セクションは、折りたたみ可能な UI 要素としてレンダリングされますが、これによりユーザーから情報が隠されます。アドオンを合理化し、ユーザーが必要とするものを正確に提供するようにします。

 エラーカードを使用する
エラー状態のカードを作成する。アドオンでエラーが発生した場合は、エラー情報と、可能であれば修正方法を示すカードが表示されます。たとえば、承認に失敗したためにアドオンが Google 以外のサービスに接続できなかった場合は、その旨を示すカードを表示し、使用しているアカウント情報を確認するようユーザーに依頼します。

 テストとテスト メッセージを作成する
作成したすべてのアドオンを十分にテストする必要があります。テストデータを使用してカードとウィジェットを作成するテスト関数を作成し、オブジェクトが想定どおりに作成されていることを確認します。

通常、アクション コールバック関数を使用する場合は、レスポンス オブジェクトを作成する必要があります。次のようなステートメントを使用して、レスポンスが正しく作成されていることを確認できます。


    Logger.log(response.printJson());
作成したテスト関数は、[Run] メニューを使用して Apps Script エディタから直接実行できます。有効なアドオンが動作したら、テストできるように未公開バージョンをインストールしてください。

アドオンが拡張するホスト アプリケーションごとに適切なテストデータを使用します。たとえば、アドオンが Gmail を拡張する場合は、さまざまなメッセージ コンテンツが指定されたときにアドオンが想定どおりに機能することを確認するために、いくつかのテストメールとそのメッセージ ID が必要になる可能性があります。特定のメッセージのメール ID を取得するには、Gmail API users.messages.list メソッドを使用してメールを一覧表示するか、Apps Script の Gmail サービスを使用します。

カレンダー カンファレンスのベスト プラクティス
アドオンで サードパーティのカレンダー会議オプションを Google カレンダーに統合する場合は、次のベスト プラクティスも実施してください。

 onCreateFunction ライトを点灯したままにする
マニフェストで定義した各 onCreateFunction は、ユーザーがそのタイプの会議ソリューションを作成しようとすると同期的に呼び出されます。これらの関数は、会議の作成に必要な最小限の作業のみを行うようにしてください。これらの関数で処理を行うことが多すぎると、アドオンのユーザー エクスペリエンスが低下する可能性があります。

 会議データに適切な ConferenceData フィールドを使用する
ConferenceData オブジェクトを作成するときに、会議の詳細（アクセスコード、電話番号、ピン、URI など）を入力できます。この情報には、対応する EntryPoint フィールドを使用してください。これらの詳細は ConferenceData メモ フィールドに入力しないでください。

 カレンダーの予定に会議の詳細を追加しない
アドオンで、作成されたサードパーティ製会議に関する情報をカレンダーの予定の説明に追加する必要はありません。カレンダーでは、必要に応じてこの処理が自動的に行われます。

制限

bookmark_border


アドオンの機能にはいくつかの制限があります。これらの落とし穴を回避して、ユーザーの全体的なエクスペリエンスを向上させましょう。

一般的な制限事項
すべてのアドオンに次の制限が適用されます。次のことは行わないでください。

Google Workspace の機能を変更する
アドオン フレームワークは、Google Workspace アプリケーションを強化するために設計されており、制限を追加するためのものではありません。そのため、既存の機能を変更したり、Google Workspace ドキュメントの共有モデルをロックダウンしたりすることはできません。

インストール時にユーザーに課金する
アドオンのインストールに対してユーザーに課金する方法は提供されていません。また、アドオンに広告を含めることはできません。ただし、独自の支払いシステムをロールアウトしたり、既存の請求データベースを呼び出したりすることはできます。アドオンは、ユーザーに請求する Google 以外のサービスに接続できます。

多くのイベントを検出する
特定のトリガーを除き、アドオンはユーザーがアドオン外で行った操作を認識できません。たとえば、ユーザーがホスト アプリケーションのツールバーをクリックしたタイミングを検出することはできません。サイドバーのクライアントサイド コードからファイルの内容の変更をポーリングすることは可能ですが、常にわずかな遅延が発生します。

Google Workspace アドオン
次の制限は、Google Workspace アドオンと Card サービスの使用にのみ適用されます。次のことは行わないでください。

 すべての Google Workspace アプリを拡張する
Google Workspace アドオンは、Gmail、カレンダー、ドライブ、Meet、ドキュメント、スプレッドシート、スライドのみを拡張できます。最終的には、Google Workspace アドオンで他の Google Workspace アプリケーションを拡張できるようになります。

 エディタでのドキュメントのコンテキスト
Google Workspace アドオンは、エディタでのドキュメント コンテキストの使用をまだサポートしていません。つまり、SpreadsheetApp.getActiveSpreadsheet() などのメソッドを使用して現在のドキュメントを取得することはできません。

 HTML/CSS またはクライアントサイド スクリプトを使用する
Google Workspace アドオンでは、カードベースのインターフェースを使用する必要があります。エディタ アドオンでサポートされている HTML/CSS インターフェースは使用できません。Google Workspace アドオンは、ユーザー インターフェースの構築にウィジェットベースのアプローチを使用します。これにより、各プラットフォーム用のインターフェースを構築しなくても、アドオンをデスクトップ プラットフォームとモバイル プラットフォームの両方で適切に動作させることができます。

 モバイルのフルサポート
当面の間、Google Workspace アドオンはパソコンのウェブ クライアントで機能します。コンテキストに応じたトリガー（Gmail メッセージの閲覧など）も、Gmail モバイルアプリ内からサポートされています。コンテキストに応じないホームページは、Gmail、カレンダー、ドライブのモバイルアプリからはまだ利用できません。Google Workspace アドオンは、モバイル ウェブブラウザからはご利用いただけません。

Apps Script トリガーを使用する
Google Workspace アドオンでは、Apps Script のシンプルなトリガーを作成または使用することはできません。

SVG 画像を使用する
現在、カード サービスのカードとウィジェットでは SVG 画像を使用できません。

100 個を超えるウィジェットがある
パフォーマンス上の理由から、カードに追加できるウィジェットまたはカード セクションは 100 個までです。

用語集

bookmark_border


このドキュメントでは、次の用語を使用します。

カレンダーのビデオ会議アドオン
会議プロバイダが Google カレンダーの予定で会議オプションを表示できるようにするために使用される特別な種類のアドオン。これらのアドオンが接続するには、十分に開発された会議ソリューションが必要です。この要件により、ほとんどのデベロッパーはカレンダー カンファレンス アドオンを作成する必要はありません。

詳しくは、カレンダーの会議アドオンをご覧ください。カレンダーの会議アドオンを Google Workspace アドオンに変換する方法については、公開済みのアドオンをアップグレードするもご覧ください。

カード
アドオン UI の単一の「ページ」。カードは、さまざまなウィジェット オブジェクト（ボタン、テキスト フィールド、ヘッダーなど）で構成されます。

詳しくは、カードをご覧ください。

カードベース
ユーザー インターフェースがサイドバーのペインとして表示されるアドオン（モバイルの場合は、メニューからアクセスできる別のアクティビティ ウィンドウとして表示されるアドオン）。アドオンには、アドオンを識別し、カード（アドオンの UI の「ページ」）を表示する上部ツールバーがあります。

Google Workspace アドオンはカードベースです。

会議データ
Google Workspace アドオンまたはカレンダー会議アドオンで有効になっているサードパーティの会議をユーザーが作成して参加できるようにするために、Google カレンダーが必要とする一連の情報。

詳しくは、会議データをご覧ください。

会議ソリューション
Google Workspace アドオンまたはカレンダーの会議用アドオンを使用して Google カレンダーから作成できるサードパーティの会議を表します。

詳細については、会議ソリューションをご覧ください。

コンテキスト
ホスト アプリケーションの現在の状態。たとえば、Gmail で現在開いているメッセージ、編集中のカレンダーの予定、選択したドライブ ファイルは、ホスト アプリケーションの現在のコンテキストの一部です。コンテキストは、他の情報とともにイベント オブジェクトに収集され、パラメータとしてトリガー関数に渡されます。

コンテキスト トリガー
ユーザーが特定のコンテキストに入ったときにトリガーされるトリガーを定義する手法（Gmail でメールスレッドを開いたときなど）。コンテキスト トリガーを使用すると、アドオンはそのコンテキストに関連する UI を提供できます。コンテキスト トリガーは、アドオン スクリプト プロジェクトのマニフェストで構成されるため、マニフェスト トリガーの一種です。

エディタのアドオン
Google ドキュメント、スプレッドシート、フォーム、スライドの拡張のみを許可する、元のアドオン タイプ。エディタ アドオンはカードベースではなく、デベロッパーが未加工の HTML と CSS から UI を作成する必要がありました。各エディタ アドオンで拡張できるホスト アプリケーションは 1 つのみです。

詳細については、エディタ アドオンをご覧ください。

イベント オブジェクト
ホームページがリクエストされたとき、アドオンがレスポンスする必要があるコンテキストに入ったとき、またはユーザーがアドオン インターフェースのウィジェットを操作した結果として自動的に作成される JSON オブジェクト。作成されたイベント オブジェクトは、指定されたトリガー関数またはコールバック関数に渡されます。イベント オブジェクトの目的は、ユーザーのクライアントサイド環境からアドオンのサーバーサイド コードに情報を渡すことです（アドオンのインターフェース ウィジェットに入力した情報など）。サーバーサイド コードは、その情報に基づいて適切なレスポンスを返すことができます。

詳細については、イベント オブジェクトをご覧ください。

Gmail アドオン
Gmail のみを拡張するアドオン。Gmail アドオンはカードベースです。Gmail アドオンの作成に使用される機能、動作、開発の詳細の多くは、Google Workspace アドオンの作成に使用される詳細と同一です。

詳しくは、Gmail アドオンをご覧ください。Gmail アドオンを Google Workspace アドオンに変換する方法については、公開済みのアドオンをアップグレードするもご覧ください。

ホームページ
アドオンのルート UI カード。ホームページは、ユーザーがアドオンを開いたときに表示され、アドオンが特定のコンテキスト外でコンテンツを表示できるようにします（たとえば、ユーザーが Gmail でメールスレッドを表示しているが、開いていないときなど）。アドオンのホームページの外観と動作は、他のカードと同様に定義します。

詳しくは、ホームページをご覧ください。

ホストまたはホスト アプリケーション
Google Workspace アドオンが拡張する Google Workspace アプリケーション（Gmail や Google カレンダーなど）。

HTML ベース
ユーザー インターフェースが、App Script の組み込みのカード サービスではなく、HTML と CSS を使用して定義されているアドオン。HTML ベースなのは、古いエディタ アドオンのみです。

リンク プレビュー トリガー
リンク プレビューは、ユーザーが Google ホスト アプリケーション（Google ドキュメントなど）内でサードパーティまたは Google 以外の URL を操作したときにトリガーされます。リンク プレビューのトリガーを使用すると、サービスまたは API からプレビューする URL パターンを定義し、スマートチップやプレビュー カードなどのプレビュー コンテンツを構成できます。リンク プレビュー トリガーはアドオン スクリプト プロジェクトのマニフェストで設定されるため、マニフェスト トリガーの一種です。

詳しくは、スマートチップを使用してリンクをプレビューするをご覧ください。

マニフェスト
Apps Script プロジェクトに関連付けられた JSON ファイル。マニフェストは、スクリプトが正しく実行するために必要なプロジェクト情報を定義するために使用されます。Google Workspace アドオンの場合、マニフェストは、アドオンが拡張できるホストと、特定の UI コントロール設定を指定するのに使用されます。

マニフェスト トリガー
プロジェクトのマニフェストで定義されたトリガー（ホームページ トリガーやコンテキスト トリガーなど）。マニフェスト トリガーは、アドオンのホームページがリクエストされたとき、または表示の更新が必要なコンテキストにアドオンが入ったときに、新しいカードを作成して表示するためにのみ使用されます。

マニフェスト トリガーは、（シンプル トリガーなど）組み込まれていないため、Apps Script の他のトリガーとは異なります。また、Apps Script のスクリプト サービスを使用してプログラムで作成することもできません（インストール可能なトリガーなど）。

コンテキストに依存しないカード
ユーザーが特定のコンテキスト外にいるときにコンテンツを表示するカード。たとえば、Gmail でメールスレッドを表示しているが、開いていないときなどです。ホームページはコンテキストに依存しないカードの一種です。

サイドバー
ホスト UI の右側のセクション。Google Workspace アドオンの UI が表示されます。Gmail とエディタのアドオンでサイドバーを定義することもできます。

スマートチップ
スマートチップは、Google Workspace アプリケーション内のユーザー、ファイル、カレンダーの予定などのエンティティの参照です。ユーザーはチップにカーソルを合わせると、ファイルやリンクに関する追加のコンテンツをプレビューすることもできます。たとえば、Google スライドのプレゼンテーションのチップにカーソルを合わせると、スライドのスクリーンショット、プレゼンテーションのオーナー、プレゼンテーションを以前に表示したかどうかが表示されます。

スマートチップを使用してサードパーティ サービスまたは Google 以外のサービスのリンクをプレビューするようにアドオンを構成できます。Google ドキュメントでリンクをプレビューするをご覧ください。

トリガー
Apps Script プロジェクトまたはアドオンで定義された条件と自動イベント レスポンス。トリガーは、関連するイベントが発生したときに（アドオンが開かれたときなど）発動され、指定された Apps Script 関数（トリガー関数）が自動的に実行されます。Google Workspace アドオンの場合、トリガー関数は、アドオン UI のどの部分を表示するかを制御するために、新しいカードを作成することがよくあります。トリガーを設定できるのは、特定のイベントタイプに限られます。

詳しくは、アドオン トリガーをご覧ください。

トリガー関数
トリガーがトリガーされたときに実行されるプロジェクト内の Apps Script 関数。

ウィジェット
ボタン、テキスト フィールド、チェックボックスなどの UI 要素。カードは、Apps Script の組み込みのカード サービスで定義された一連のウィジェット オブジェクトから作成されます。

詳しくは、ウィジェットをご覧ください。

ウィジェット ハンドラ関数
特定のウィジェットを特定のアクション オブジェクトにリンクする関数。各ウィジェット タイプには、アクションへの接続に使用できる定義済みのウィジェット ハンドラ関数があります。ウィジェット ハンドラ関数は、結果のアクションをトリガーするユーザー操作の種類を定義します。これは、ウィジェットのインタラクティビティの重要なコンポーネントです。

詳細については、ウィジェット ハンドラ関数をご覧ください。

この情報は役に立ちましたか？


