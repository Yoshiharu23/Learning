# 機械学習

学習アルゴリズムの数式を実装に対応づけ、実験と可視化を通じて挙動を確認する記録です。

| テーマ | 学習・検証の内容 | 記録 |
| --- | --- | --- |
| パーセプトロンの幾何・更新則・収束 | 直交射影、内積、勾配と劣勾配、更新回数の上界、線形分離できない例、双対形式 | [README](perceptron/README.md) / [Notebook](perceptron/notebooks/perceptron_geometry_convergence_gradient_lab.ipynb) |
| ポテンシャル関数法・双対パーセプトロン | ガウス型ポテンシャル関数、グラム行列、双対係数の更新、寄与ベクトル、決定境界、σの比較 | [README](potential-function-dual-perceptron/README.md) / [Notebook](potential-function-dual-perceptron/notebooks/potential_function_dual_perceptron.ipynb) |
| 正則化：Ridge・Lasso | 固有値と縮小率、劣微分、ソフト閾値、座標降下法、係数パス、CV、人工データの予測・変数選択 | [README](regularization/README.md) / [Notebook](regularization/notebooks/ridge_lasso_regularization.ipynb) |
| 物体中心表現・動画モデル | Slot Attention、SAVi型のスロット更新、意味・位置の分離、再構成と追跡評価 | [世界モデル2025プロジェクト](../projects/world-model-2025/README.md) |

## 関連する数学の学習記録

- [線形代数](../mathematics/linear-algebra/README.md)：階数・固有値・非負定値性・SVDを実装と図で確認し、回帰・正則化・PCAにつながる性質を整理。

[リポジトリのトップへ](../README.md)
