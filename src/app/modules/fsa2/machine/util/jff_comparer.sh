example_names=(1_1_m1 1_1_m2 1_3 1_16_a 1_16_b 1_7 1_41 1_38 1_35 1_33 1_30 1_21 1_13 1_11);
for machine in "${example_names[@]}";
do java -jar jflaplib-cli-1.3-bundle.jar equivalent ./JFLAP_JFFs/jflap$machine ./FLAPJS_JFFs/flapjs$machine;
done
