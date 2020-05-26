cc.Global.getLevelByExp = function(exp){
    var level = "Dân đen";
    if(exp >=250000) level = "Vương gia";
    else if(exp >=100000) level = "Tể tướng";
    else if(exp >=50000) level = "Thừa tướng";
    else if(exp >=13200) level = "Thái sư";
    else if(exp >=9800) level = "Đô đốc";
    else if(exp >=7200) level = "Thượng thư";
    else if(exp >=4800) level = "Đề đốc";

    else if(exp >=2800) level = "Tổng Đốc";
    else if(exp >=1800) level = "Tuần Phủ";
    else if(exp >=1200) level = "Tri phủ";
    else if(exp >=1000) level = "Tri huyện";
    else if(exp >=850) level = "Lý trưởng";
    else if(exp >=700) level = "Hương trưởng";
    else if(exp >=550) level = "Địa chủ";
    else if(exp >=400) level = "Phú ông";
    else if(exp >=250) level = "Cai đội";
    else if(exp >=130) level = "Tiểu nhị";
    else if(exp >=50) level = "Phụ hồ";

    return level;
};