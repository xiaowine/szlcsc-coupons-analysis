# 优惠券信息结构体
class Coupon:
    def __init__(self, _discount, _name, _title, _time, _threshold):
        self.discount = _discount
        self.name = _name
        self.title = _title
        self.time = _time
        self.threshold = _threshold


class Brand:
    def __init__(self, name, count, uuids, total_discount):
        self.name = name
        self.count = count
        self.uuids = uuids
        self.total_discount = total_discount


class MonthlyExpiry:
    def __init__(self, month, count, total_discount, uuids):
        self.month = month
        self.count = count
        self.total_discount = total_discount
        self.uuids = uuids


class ThresholdStage:
    def __init__(self, stage, count, total_discount, uuids):
        self.stage = stage
        self.count = count
        self.total_discount = total_discount
        self.uuids = uuids


class FreeShipping:
    def __init__(self, count, uuids, total_discount, monthly_counts):
        self.count = count
        self.uuids = uuids
        self.total_discount = total_discount
        self.monthly_counts = monthly_counts
